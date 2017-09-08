import axios from 'axios';
import logger from 'winston';
import config from '../config';
import axiosErrorHandler from '../util/errorHandlers';
import datalabRepository from '../dataaccess/datalabRepository';
import notebookRepository from '../dataaccess/notebookRepository';

const NOTEBOOK_CREATION_URL = `${config.get('infrastructureApi')}/notebooks`;
const ERROR_MESSAGE = 'Unable to create Notebook';

function createNotebook(user, datalabName, { name, notebookType }) {
  logger.info(`Requesting notebook creation for ${notebookType} called '${name}'`);
  return datalabRepository.getByName(user, datalabName)
    .then(storeAndCreateNotebook(user, name, notebookType))
    .catch(axiosErrorHandler(ERROR_MESSAGE));
}

const storeAndCreateNotebook = (user, notebookName, notebookType) => (datalabInfo) => {
  const notebook = {
    name: notebookName,
    displayName: notebookName,
    type: notebookType,
    url: `https://datalab-${notebookName}.datalabs.nerc.ac.uk`,
    internalEndpoint: `http://jupyter-${notebookName}`,
  };

  return notebookRepository.createOrUpdate(user, notebook)
    .then(sendCreationRequest(notebookName, notebookType, datalabInfo))
    .then(() => notebook);
};

const sendCreationRequest = (notebookName, notebookType, datalabInfo) => () => {
  const payload = {
    datalabInfo,
    notebookId: notebookName,
    notebookType,
  };
  logger.debug(`Creation Request Url: ${NOTEBOOK_CREATION_URL} payload ${JSON.stringify(payload)}`);
  return axios.post(NOTEBOOK_CREATION_URL, payload)
    .then(response => logger.info(response.data));
};

export default { createNotebook };
