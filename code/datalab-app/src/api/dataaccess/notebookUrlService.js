import axios from 'axios';
import logger from 'winston';
import { findLast } from 'lodash';
import vault from './vault/vault';
import { JUPYTER, ZEPPELIN, RSTUDIO } from '../../shared/notebookTypes';
import config from '../config';
import rstudioTokenService from './login/rstudioTokenService';

const DATALAB_NAME = config.get('datalabName');
const RSTUDIO_USERNAME = 'datalab';

export default function notebookUrlService(notebook, user) {
  if (notebook.type === ZEPPELIN) {
    return requestZeppelinToken(notebook, user)
      .then(createZeppelinUrl(notebook));
  } else if (notebook.type === JUPYTER) {
    return requestJupyterToken(notebook, user)
      .then(createJupyterUrl(notebook));
  } else if (notebook.type === RSTUDIO) {
    return requestRStudioToken(notebook, user)
      .then(createRStudioUrl(notebook));
  }
  return Promise.resolve(notebook.url);
}

const createZeppelinUrl = notebook => token => (token ? `${notebook.url}/connect?token=${token}` : undefined);

const createJupyterUrl = notebook => token => (token ? `${notebook.url}/tree/?token=${token}` : undefined);

const createRStudioUrl = notebook => tokens =>
  (tokens ? `${notebook.url}/connect?username=${RSTUDIO_USERNAME}&expires=${tokens.expires}&token=${tokens.token}&csrfToken=${tokens.csrfToken}` : undefined);

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

function requestRStudioToken(notebook, user) {
  return vault.requestNotebookKeys(DATALAB_NAME, notebook)
    .then(rstudioTokenService.rstudioLogin(notebook))
    .catch((error) => {
      logger.error('Error logging in to RStudio: ', notebook.name, error);
      return undefined;
    });
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
