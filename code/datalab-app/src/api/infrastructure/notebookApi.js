import axios from 'axios';
import logger from 'winston';
import config from '../config';
import axiosErrorHandler from '../util/errorHandlers';
import datalabRepository from '../dataaccess/datalabRepository';
import notebookRepository from '../dataaccess/notebookRepository';

const NOTEBOOK_CREATION_URL = `${config.get('infrastructureApi')}/notebooks`;
const ERROR_MESSAGE = 'Unable to create Notebook';

/* Notebook creation API
 * This performs the following steps:
 * - Loads information about the datalab
 * - Creates or updates any existing notebook
 * - Sends creation request to the infrastructure service
 */
function createNotebook(user, datalabName, notebook) {
  logger.info(`Requesting notebook creation for ${notebook.type} called '${notebook.name}'`);
  return datalabRepository.getByName(user, datalabName)
    .then(storeAndCreateNotebook(user, notebook))
    .catch(axiosErrorHandler(ERROR_MESSAGE));
}

const storeAndCreateNotebook = (user, notebook) => (datalabInfo) => {
  const notebookRequest = {
    ...notebook,
    url: `https://${datalabInfo.name}-${notebook.name}.${datalabInfo.domain}`,
    internalEndpoint: `http://jupyter-${notebook.name}`,
  };

  return notebookRepository.createOrUpdate(user, notebookRequest)
    .then(sendCreationRequest(notebookRequest, datalabInfo))
    .then(() => notebook);
};

const sendCreationRequest = (notebookRequest, datalabInfo) => () => {
  const payload = {
    datalabInfo,
    notebookId: notebookRequest.name,
    notebookType: notebookRequest.type,
  };
  logger.debug(`Creation Request Url: ${NOTEBOOK_CREATION_URL} payload ${JSON.stringify(payload)}`);
  return axios.post(NOTEBOOK_CREATION_URL, payload)
    .then(response => logger.info(response.data));
};

export default { createNotebook };
