import logger from 'winston';
import secretManager from '../credentials/secretManager';

function createNotebook(datalabName, notebookId, notebookType) {
  logger.info(`Creating new ${notebookType} notebook with id: ${notebookId} for datalab: ${datalabName}`);
  return secretManager.createNewJupyterCredentials(datalabName, notebookId);
}

export default { createNotebook };
