import axios from 'axios';
import logger from 'winston';
import config from '../config';
import axiosErrorHandler from '../util/errorHandlers';
import datalabRepository from '../dataaccess/datalabRepository';
import notebookRepository from '../dataaccess/notebookRepository';

const STACK_URL = `${config.get('infrastructureApi')}/stacks`;
const CREATE_ERROR_MESSAGE = 'Unable to create Stack';
const DELETE_ERROR_MESSAGE = 'Unable to delete Stack';

/* Notebook creation API
 * This performs the following steps:
 * - Loads information about the datalab
 * - Creates or updates any existing notebook
 * - Sends creation request to the infrastructure service
 */
function createNotebook(user, datalabName, notebook) {
  logger.info(`Requesting stack creation for ${notebook.type} called '${notebook.name}'`);
  return datalabRepository.getByName(user, datalabName)
    .then(storeAndCreateNotebook(user, notebook))
    .catch(axiosErrorHandler(CREATE_ERROR_MESSAGE));
}

function deleteNotebook(user, datalabName, notebook) {
  logger.info(`Requesting stack deletion for ${notebook.type} called '${notebook.name}'`);
  return datalabRepository.getByName(user, datalabName)
    .then(removeAndDeleteNotebook(user, notebook))
    .then(() => notebook)
    .catch(axiosErrorHandler(DELETE_ERROR_MESSAGE));
}

const storeAndCreateNotebook = (user, notebook) => (datalabInfo) => {
  const notebookRequest = {
    ...notebook,
    url: `https://${datalabInfo.name}-${notebook.name}.${datalabInfo.domain}`,
    internalEndpoint: `http://${notebook.type}-${notebook.name}`,
  };

  return notebookRepository.createOrUpdate(user, notebookRequest)
    .then(sendCreationRequest(notebookRequest, datalabInfo))
    .then(() => notebook);
};

const sendCreationRequest = (notebookRequest, datalabInfo) => () => {
  const payload = {
    datalabInfo,
    name: notebookRequest.name,
    type: notebookRequest.type,
  };
  logger.debug(`Creation Request Url: ${STACK_URL} payload ${JSON.stringify(payload)}`);
  return axios.post(STACK_URL, payload)
    .then(response => logger.info(response.data));
};

const removeAndDeleteNotebook = (user, notebook) => datalabInfo =>
  sendDeletionRequest(user, notebook, datalabInfo)
    .then(notebookRepository.deleteByName(user, notebook.name));

const sendDeletionRequest = (user, notebook, datalabInfo) => {
  const payload = {
    datalabInfo,
    name: notebook.name,
    type: notebook.type,
  };

  logger.debug(`Deletion Request Url: ${STACK_URL} payload ${JSON.stringify(payload)}`);
  return axios.delete(STACK_URL, { data: payload })
    .then(response => logger.info(response.data));
};

export default { createNotebook, deleteNotebook };
