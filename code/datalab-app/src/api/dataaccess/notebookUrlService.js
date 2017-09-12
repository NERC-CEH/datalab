import axios from 'axios';
import logger from 'winston';
import { findLast } from 'lodash';
import vault from './vault/vault';
import { JUPYTER, ZEPPELIN } from '../../shared/notebookTypes';
import config from '../config';

const DATALAB_NAME = config.get('datalabName');

export default function notebookUrlService(notebook, user) {
  if (notebook.type === ZEPPELIN) {
    return requestZeppelinToken(notebook, user)
      .then(createZeppelinUrl(notebook));
  } else if (notebook.type === JUPYTER) {
    return requestJupyterToken(notebook, user)
      .then(createJupyterUrl(notebook));
  }
  return undefined;
}

const createZeppelinUrl = notebook => token => (token ? `${notebook.url}/connect?token=${token}` : undefined);

const createJupyterUrl = notebook => token => (token ? `${notebook.url}/tree/?token=${token}` : undefined);

function requestZeppelinToken(notebook, user) {
  return vault.requestNotebookKeys(DATALAB_NAME, notebook)
    .then(zeppelinLogin(notebook))
    .catch((error) => {
      logger.error('Error logging in to zeppelin: ', notebook.name, error);
      return undefined;
    });
}

function requestJupyterToken(notebook, user) {
  return vault.requestNotebookKeys(DATALAB_NAME, notebook)
    .then(response => response.token);
}

const zeppelinLogin = notebook => (credentials) => {
  if (!credentials.username || !credentials.password) {
    return Promise.reject(new Error('username or password not defined'));
  }

  return axios.post(getZeppelinLoginUrl(notebook), createLoginPayload(credentials))
    .then(processLoginResponse);
};

function getZeppelinLoginUrl(notebook) {
  const zeppelinUrl = `${notebook.internalEndpoint}/api/login`;
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

  const headers = loginResponse.headers;
  const sessionCookie = findLast(headers['set-cookie'], header => header.indexOf('JSESSIONID') > -1);
  return sessionCookie.split(';')[0].split('=')[1];
}
