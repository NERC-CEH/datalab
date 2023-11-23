import logger from 'winston';
import { stackTypes } from 'common';
import rstudioTokenService from './login/rstudioTokenService';
import zeppelinLogin from './login/zeppelinLogin';
import secrets from './secrets/secrets';
import stackService from './stackService';

// NOTE: All other stack details should come from 'common/src/config/images'
const { JUPYTER, JUPYTERLAB, ZEPPELIN, RSTUDIO, NBVIEWER, VSCODE } = stackTypes;
const RSTUDIO_USERNAME = 'datalab';

export default function notebookUrlService(projectKey, notebook, userToken) {
  updateAccessTime(projectKey, notebook.name, userToken);
  if (notebook.type === ZEPPELIN) {
    return requestZeppelinToken(projectKey, notebook, userToken)
      .then(createZeppelinUrl(notebook));
  } if (notebook.type === JUPYTER || notebook.type === JUPYTERLAB) {
    return requestStackToken(projectKey, notebook, userToken)
      .then(createJupyterUrl(notebook));
  } if (notebook.type === RSTUDIO) {
    return requestRStudioToken(projectKey, notebook, userToken)
      .then(createRStudioUrl(notebook));
  } if (notebook.type === NBVIEWER) {
    return Promise.resolve(`${notebook.url}/localfile`);
  } if (notebook.type === VSCODE) {
    return requestStackToken(projectKey, notebook, userToken)
      .then(createVscodeUrl(notebook));
  }
  return Promise.resolve(notebook.url);
}

const createVscodeUrl = notebook => token => (token ? `${notebook.url}?tkn=${token}` : undefined);

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

function requestZeppelinToken(projectKey, stack, userToken) {
  return secrets.getStackSecret(stack, projectKey, userToken)
    .then(zeppelinLogin(stack))
    .catch((error) => {
      logger.error('Error logging in to zeppelin: ', stack.name, error);
      return undefined;
    });
}

function requestStackToken(projectKey, stack, userToken) {
  return secrets.getStackSecret(stack, projectKey, userToken)
    .then(response => response.token);
}

function requestRStudioToken(projectKey, stack, userToken) {
  return secrets.getStackSecret(stack, projectKey, userToken)
    .then(rstudioTokenService.rstudioLogin(stack))
    .catch((error) => {
      logger.error('Error logging in to RStudio: ', stack.name, error);
      return undefined;
    });
}

async function updateAccessTime(projectKey, name, userToken) {
  logger.info(`Updating access time for: Project: ${projectKey}, Notebook: ${name}`);
  try {
    await stackService.updateAccessTime(projectKey, name, userToken);
  } catch (error) {
    logger.error(error);
  }
  return true;
}
