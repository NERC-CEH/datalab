const fs = require('fs');
const path = require('path');
const lighthouse = require('lighthouse');
const puppeteer = require('puppeteer');
const generateReadme = require('./generate-readme-module');

const BASE_URL = 'https://testlab.test-datalabs.nerc.ac.uk';
const PROJECT_TO_TEST = 'lhouse'; // the child project pages (e.g. notebooks) will be tested using this project

const INSECURE_ENDPOINTS = [ // endpoints to test before logging in
  '/',
  '/verify',
];
const SECURE_ENDPOINTS = [ // endpoints to test once logged in
  '/admin/resources',
  '/projects',
  `/projects/${PROJECT_TO_TEST}/dask`,
  `/projects/${PROJECT_TO_TEST}/info`,
  `/projects/${PROJECT_TO_TEST}/notebooks`,
  `/projects/${PROJECT_TO_TEST}/publishing`,
  `/projects/${PROJECT_TO_TEST}/settings`,
  `/projects/${PROJECT_TO_TEST}/spark`,
  `/projects/${PROJECT_TO_TEST}/storage`,
  '/404', // doesn't exist but should give 404 page to test
];

const CHROME_PORT = 8041; // port on which debug connection is opened on chrome to allow puppeteer and lighthouse to interact with it
const OUTPUT_FORMAT = 'json'; // the format used to write reports to file. One of 'json', 'html'
const REPORTS_DIR = './reports'; // directory to output lighthouse reports too

// user name and password used to authenticate with DataLabs
const USER_NAME = getEnvVarValue('LIGHTHOUSE_TEST_USER_NAME');
const PASSWORD = getEnvVarValue('LIGHTHOUSE_TEST_PASSWORD');

async function runTests() {
  const chrome = await startChrome();

  let results = {};
  results = await runLighthouseForEndpoints(INSECURE_ENDPOINTS, OUTPUT_FORMAT, results);
  await logIn(chrome);
  results = await runLighthouseForEndpoints(SECURE_ENDPOINTS, OUTPUT_FORMAT, results);

  await closeChrome(chrome);

  writeReportsToFiles(results, OUTPUT_FORMAT);
  generateReadme(BASE_URL);
}

async function startChrome() {
  return puppeteer.launch({
    args: [`--remote-debugging-port=${CHROME_PORT}`],
    headless: false, // Optional, if you want to see the tests in action.
    slowMo: 5, // Bigger value makes puppeteer's interactions slower e.g. typing in forms
  });
}

async function closeChrome(chrome) {
  await chrome.close();
}

async function logIn(chrome) {
  const page = await chrome.newPage();
  await page.goto(`${BASE_URL}/random-url-to-be-redirected-to-login`);
  await page.waitForNavigation();

  const emailInput = await page.waitForSelector('input[type="email"]', { visible: true });
  await emailInput.type(USER_NAME);

  const passwordInput = await page.waitForSelector('input[type="password"]', { visible: true });
  await passwordInput.type(PASSWORD);

  await page.keyboard.press('Enter'); // submits the login form
  await page.waitForNavigation({ waitUntil: 'networkidle0' }); // wait for all network communication to stop
  await page.close();
}

async function runLighthouseForEndpoints(endpoints, outputFormat, results = {}) {
  // results can be passed the output of a previous call to this function to build up
  // an object of all of the results e.g. test some while logged out, then some while logged in

  const options = {
    output: outputFormat,
    port: CHROME_PORT,
    disableStorageReset: true, // keeps login information across lighthouse tests
    emulatedFormFactor: 'desktop', // test desktop size as that is our main use case
  };

  // build and return object with endpoint as key and report as value
  return endpoints.reduce(async (accumulatorPromise, endpoint) => {
    const accumulator = await accumulatorPromise;
    accumulator[endpoint] = await lighthouse(`${BASE_URL}${endpoint}`, options);
    return accumulator;
  }, Promise.resolve(results));
}

function writeReportsToFiles(results, outputFormat) {
  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR);

  const findSlashesRegex = new RegExp('/', 'g');

  Object.entries(results).forEach(
    ([endpoint, runnerResult]) => {
      const filePath = path.join(
        REPORTS_DIR,
        `lhreport${endpoint.replace(findSlashesRegex, '-')}.${outputFormat}`,
      );

      try {
        fs.writeFileSync(filePath, runnerResult.report);
      } catch (error) {
        console.error(`Error writing file ${filePath}`);
      }
    },
  );
}

function getEnvVarValue(name) {
  const value = process.env[name];
  if (!value) throw new Error(`No value found for environment variable ${name}. A value must be set.`);
  return value;
}

// Run the tests when this file is executed
(async () => {
  await runTests();
})();
