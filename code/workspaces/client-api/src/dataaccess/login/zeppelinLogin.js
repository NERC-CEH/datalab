import axios from 'axios';
import logger from 'winston';
import { findLast } from 'lodash';
import { getCorrectAccessUrl } from './common';

const zeppelinLogin = notebook => (credentials) => {
  if (!credentials.username || !credentials.password) {
    return Promise.reject(new Error('username or password not defined'));
  }

  return axios.post(getZeppelinLoginUrl(notebook), createLoginPayload(credentials))
    .then(processLoginResponse);
};

function getZeppelinLoginUrl(notebook) {
  const urlRoot = getCorrectAccessUrl(notebook);
  const zeppelinUrl = `${urlRoot}/api/login`;
  logger.info(`Request log in cookie from Zeppelin at: ${zeppelinUrl}`);
  return zeppelinUrl;
}

function createLoginPayload(credentials) {
  return `userName=${credentials.username}&password=${credentials.password}`;
}

function processLoginResponse(loginResponse) {
  if (loginResponse.data.error) {
    return Promise.reject(new Error(`Zeppelin login failed ${loginResponse.data.error.message}`));
  }

  const { headers } = loginResponse;
  const sessionCookie = findLast(headers['set-cookie'], header => header.indexOf('JSESSIONID') > -1);
  return sessionCookie.split(';')[0].split('=')[1];
}

export default zeppelinLogin;
