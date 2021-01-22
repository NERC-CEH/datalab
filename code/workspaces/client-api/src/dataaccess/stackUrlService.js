import logger from 'winston';
import { stackTypes } from 'common';
import rstudioTokenService from './login/rstudioTokenService';
import vault from './vault/vault';
import zeppelinLogin from './login/zeppelinLogin';

// NOTE: All other stack details should come from 'common/src/config/images'
const { JUPYTER, JUPYTERLAB, ZEPPELIN, RSTUDIO, NBVIEWER } = stackTypes;
const RSTUDIO_USERNAME = 'datalab';

export default function notebookUrlService(projectKey, notebook) {
  if (notebook.type === ZEPPELIN) {
    return requestZeppelinToken(projectKey, notebook)
      .then(createZeppelinUrl(notebook));
  } if (notebook.type === JUPYTER || notebook.type === JUPYTERLAB) {
    return requestJupyterToken(projectKey, notebook)
      .then(createJupyterUrl(notebook));
  } if (notebook.type === RSTUDIO) {
    return requestRStudioToken(projectKey, notebook)
      .then(createRStudioUrl(notebook));
  } if (notebook.type === NBVIEWER) {
    return Promise.resolve(`${notebook.url}/localfile`);
  }
  return Promise.resolve(notebook.url);
}

const createZeppelinUrl = notebook => token => (token ? `${notebook.url}/connect?token=${token}` : undefined);

const createJupyterUrl = notebook => (token) => {
  if (token && notebook.type === JUPYTER) {
    return `${notebook.url}/tree/?token=${token}`;
  }
  if (token && notebook.type === JUPYTERLAB) {
    return `${notebook.url}/lab?token=${token}`;
  }
  return undefined;
};

const createRStudioUrl = notebook => tokens => (tokens
  ? `${notebook.url}/connect?username=${RSTUDIO_USERNAME}&expires=${tokens.expires}&token=${tokens.token}&csrfToken=${tokens.csrfToken}`
  : undefined);

function requestZeppelinToken(projectKey, stack) {
  return vault.requestStackKeys(projectKey, stack)
    .then(zeppelinLogin(stack))
    .catch((error) => {
      logger.error('Error logging in to zeppelin: ', stack.name, error);
      return undefined;
    });
}

function requestJupyterToken(projectKey, stack) {
  return vault.requestStackKeys(projectKey, stack)
    .then(response => response.token);
}

function requestRStudioToken(projectKey, stack) {
  return vault.requestStackKeys(projectKey, stack)
    .then(rstudioTokenService.rstudioLogin(stack))
    .catch((error) => {
      logger.error('Error logging in to RStudio: ', stack.name, error);
      return undefined;
    });
}

