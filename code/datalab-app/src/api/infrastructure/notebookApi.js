import axios from 'axios';
import logger from 'winston';
import has from 'lodash/has';
import config from '../config';
import datalabRepository from '../dataaccess/datalabRepository';

const NOTEBOOK_CREATION_URL = `${config.get('infrastructureApi')}/notebooks`;

function createNotebook(user, datalabName, { name, notebookType }) {
  logger.info(`Requesting notebook creation for ${notebookType} called '${name}'`);
  return datalabRepository.getByName(user, datalabName)
    .then(sendCreationRequest(name, notebookType));
}

const sendCreationRequest = (notebookName, notebookType) => (datalabInfo) => {
  const payload = {
    datalabInfo,
    notebookId: notebookName,
    notebookType,
  };
  logger.debug(`Creation Request Url: ${NOTEBOOK_CREATION_URL} payload ${JSON.stringify(payload)}`);
  return axios.post(NOTEBOOK_CREATION_URL, payload)
    .then(response => response.data)
    .catch(handleError);
};

function handleError(error) {
  if (has(error, 'response.data.message')) {
    throw new Error(`Unable to create Notebook ${error.response.data.message}`);
  }
  throw new Error(`Unable to create Notebook ${error}`);
}

export default { createNotebook };
