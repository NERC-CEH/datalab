import logger from 'winston';
import secretManager from '../credentials/secretManager';
import k8sSecretApi from '../kubernetes/secretApi';

function createNotebook(datalabName, notebookId, notebookType) {
  logger.info(`Creating new ${notebookType} notebook with id: ${notebookId} for datalab: ${datalabName}`);
  const notebookCredentials = secretManager.createNewJupyterCredentials();

  return secretManager.storeCredentialsInVault(datalabName, notebookId, notebookCredentials)
    .then(() => k8sSecretApi.createSecret(`jupyter-${notebookId}`, notebookCredentials));
}

export default { createNotebook };
