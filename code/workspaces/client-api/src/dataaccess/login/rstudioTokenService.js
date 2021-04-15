import axios from 'axios';
import querystring from 'querystring';
import logger from 'winston';
import rstudioCookieHandler from './rstudioCookieHandler';
import encrypt from '../../vendor/encrypt.min';
import { getCorrectAccessUrl } from './common';

const rstudioLogin = notebook => (credentials) => {
  if (!credentials.username || !credentials.password) {
    return Promise.reject(new Error('username or password not defined'));
  }

  return getRStudioCertificate(notebook)
    .then(login(notebook, credentials));
};

const login = (notebook, credentials) => async (response) => {
  logger.debug(`Logging in to RStudio instance at: ${getRStudioLoginUrl(notebook)}`);
  const certificateParts = response.data.split(':');
  const userPayload = `${credentials.username}\n${credentials.password}`;
  const exp = certificateParts[0];
  const mod = certificateParts[1];
  const encrypted = encrypt.encrypt(userPayload, exp, mod);

  const csrfToken = await getRStudioCsrfToken(notebook);
  const payload = querystring.stringify({
    persist: '0',
    appUri: '',
    clientPath: '/auth-sign-in',
    'csrf-token': csrfToken,
    v: encrypted,
  });

  const options = {
    maxRedirects: 0,
    // RStudio returns a 302 redirect for successful log in so we need to change
    // success validation for this request
    validateStatus: status => status >= 200 && status < 400,
    headers: {
      Cookie: `csrf-token=${csrfToken}`,
    },
  };

  try {
    const loginResponse = await axios.post(getRStudioLoginUrl(notebook), payload, options);
    logger.debug('Processing successful login response cookies');
    const cookies = loginResponse.headers['set-cookie'];
    return rstudioCookieHandler(cookies);
  } catch (error) {
    throw new Error(`Unable to log in to RStudio: ${error.message}`);
  }
};

async function getRStudioCertificate(notebook) {
  const notebookUrl = getCorrectAccessUrl(notebook);
  logger.debug(`Requesting RStudio certificate from ${notebookUrl}/auth-public-key`);
  try {
    return await axios.get(`${notebookUrl}/auth-public-key`);
  } catch (error) {
    throw new Error(`Unable to retrieve RStudio certificate: ${error.message}`);
  }
}

async function getRStudioCsrfToken(notebook) {
  const rstudioUrl = `${getCorrectAccessUrl(notebook)}/auth-sign-in`;
  logger.info(`Request CSRF cookie from RStudio at: ${rstudioUrl}`);
  try {
    const csrfToken = await axios.get(rstudioUrl);
    return csrfToken.headers['set-cookie'][0].split(';')[0].split('=')[1];
  } catch (error) {
    // For RStudio versions < 1.4 this call is expected to fail
    logger.debug(`Unable to retrieve CSRF Token: ${error.message}`);
    return false;
  }
}

function getRStudioLoginUrl(notebook) {
  const rstudioUrl = `${getCorrectAccessUrl(notebook)}/auth-do-sign-in`;
  logger.info(`Request log in cookie from RStudio at: ${rstudioUrl}`);
  return rstudioUrl;
}

export default { rstudioLogin };
