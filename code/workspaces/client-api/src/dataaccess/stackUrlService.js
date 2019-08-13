import { findLast } from 'lodash';
import axios from 'axios';
import logger from 'winston';
import { stackTypes } from 'common';
import config from '../config';
import rstudioTokenService from './login/rstudioTokenService';
import vault from './vault/vault';

const { JUPYTER, JUPYTERLAB, ZEPPELIN, RSTUDIO, NBVIEWER } = stackTypes;
const DATALAB_NAME = config.get('datalabName');
const RSTUDIO_USERNAME = 'datalab';

export default function notebookUrlService(notebook, user) {
  if (notebook.type === ZEPPELIN) {
    return requestZeppelinToken(notebook, user)
      .then(createZeppelinUrl(notebook));
  } if (notebook.type === JUPYTER) {
    return requestJupyterToken(notebook, user)
      .then(createJupyterUrl(notebook));
  } if (notebook.type === JUPYTERLAB) {
    return requestJupyterToken(notebook, user)
      .then(createJupyterlabUrl(notebook));
  } if (notebook.type === RSTUDIO) {
    return requestRStudioToken(notebook, user)
      .then(createRStudioUrl(notebook));
  } if (notebook.type === NBVIEWER) {
    return Promise.resolve(`${notebook.url}/localfile`);
  }
  return Promise.resolve(notebook.url);
}

const createZeppelinUrl = notebook => token => (token ? `${notebook.url}/connect?token=${token}` : undefined);

const createJupyterUrl = notebook => token => (token ? `${notebook.url}/tree/?token=${token}` : undefined);

const createJupyterlabUrl = notebook => token => (token ? `${notebook.url}/lab?token=${token}` : undefined);

const createRStudioUrl = notebook => tokens => (tokens
  ? `${notebook.url}/connect?username=${RSTUDIO_USERNAME}&expires=${tokens.expires}&token=${tokens.token}&csrfToken=${tokens.csrfToken}`
  : undefined);

function requestZeppelinToken(stack) { // stack, user
  return vault.requestStackKeys(DATALAB_NAME, stack)
    .then(zeppelinLogin(stack))
    .catch((error) => {
      logger.error('Error logging in to zeppelin: ', stack.name, error);
      return undefined;
    });
}

function requestJupyterToken(stack) { // stack, user
  return vault.requestStackKeys(DATALAB_NAME, stack)
    .then(response => response.token);
}

function requestRStudioToken(stack) { // stack, user
  return vault.requestStackKeys(DATALAB_NAME, stack)
    .then(rstudioTokenService.rstudioLogin(stack))
    .catch((error) => {
      logger.error('Error logging in to RStudio: ', stack.name, error);
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

  const { headers } = loginResponse;
  const sessionCookie = findLast(headers['set-cookie'], header => header.indexOf('JSESSIONID') > -1);
  return sessionCookie.split(';')[0].split('=')[1];
}
