import fs from 'fs-extra-promise';
import chalk from 'chalk';
import path from 'path';
import { render } from 'mustache';
import util from 'util';
import { exec } from 'child_process';
import YAML from 'yamljs';

const execAsync = util.promisify(exec);
const executionDir = '.bara';

function deployManifest(templatePath, configPath) {
  prepareWorkingSpace();
  const properties = YAML.load(configPath);
  const targetFilename = getTargetFileName(templatePath);

  fs.readFileAsync(templatePath)
    .then(data => data.toString())
    .then(template => render(template, properties))
    .then(renderedTemplate => fs.writeFileAsync(targetFilename, renderedTemplate))
    .then(() => execAsync(`kubectl apply -f ${targetFilename}`))
    .then(processResponse)
    .catch(console.error);
}

function prepareWorkingSpace() {
  if (!fs.existsSync(executionDir)) {
    fs.mkdirSync(executionDir);
  }
}

function getTargetFileName(sourcePath) {
  return `${executionDir}/${path.basename(sourcePath)}`;
}

function processResponse(response) {
  if (response.stdout) {
    console.log(chalk.green(response.stdout));
  } else {
    console.log(chalk.red(response.stderr));
  }
}

export default deployManifest;
