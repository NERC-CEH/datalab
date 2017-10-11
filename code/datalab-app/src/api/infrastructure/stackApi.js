import axios from 'axios';
import logger from 'winston';
import config from '../config';
import axiosErrorHandler from '../util/errorHandlers';
import datalabRepository from '../dataaccess/datalabRepository';
import stackRepository from '../dataaccess/stackRepository';

const STACK_URL = `${config.get('infrastructureApi')}/stacks`;
const CREATE_ERROR_MESSAGE = 'Unable to create Stack';
const DELETE_ERROR_MESSAGE = 'Unable to delete Stack';

/* Notebook creation API
 * This performs the following steps:
 * - Loads information about the datalab
 * - Creates or updates any existing notebook
 * - Sends creation request to the infrastructure service
 */
function createStack(user, datalabName, stack) {
  logger.info(`Requesting stack creation for ${stack.type} called '${stack.name}'`);
  return datalabRepository.getByName(user, datalabName)
    .then(storeAndCreateStack(user, stack))
    .catch(axiosErrorHandler(CREATE_ERROR_MESSAGE));
}

function deleteStack(user, datalabName, stack) {
  logger.info(`Requesting stack deletion for ${stack.type} called '${stack.name}'`);
  return datalabRepository.getByName(user, datalabName)
    .then(removeAndDeleteStack(user, stack))
    .then(() => stack)
    .catch(axiosErrorHandler(DELETE_ERROR_MESSAGE));
}

const storeAndCreateStack = (user, stack) => (datalabInfo) => {
  const stackRequest = {
    ...stack,
    url: `https://${datalabInfo.name}-${stack.name}.${datalabInfo.domain}`,
    internalEndpoint: `http://${stack.type}-${stack.name}`,
  };

  return stackRepository.createOrUpdate(user, stackRequest)
    .then(sendCreationRequest(stackRequest, datalabInfo))
    .then(() => stack);
};

const sendCreationRequest = (stackRequest, datalabInfo) => () => {
  const payload = {
    datalabInfo,
    name: stackRequest.name,
    type: stackRequest.type,
  };
  logger.debug(`Creation Request Url: ${STACK_URL} payload ${JSON.stringify(payload)}`);
  return axios.post(STACK_URL, payload)
    .then(response => logger.info(response.data));
};

const removeAndDeleteStack = (user, stack) => datalabInfo =>
  sendDeletionRequest(user, stack, datalabInfo)
    .then(stackRepository.deleteByName(user, stack.name));

const sendDeletionRequest = (user, stack, datalabInfo) => {
  const payload = {
    datalabInfo,
    name: stack.name,
    type: stack.type,
  };

  logger.debug(`Deletion Request Url: ${STACK_URL} payload ${JSON.stringify(payload)}`);
  return axios.delete(STACK_URL, { data: payload })
    .then(response => logger.info(response.data));
};

export default { createStack, deleteStack };
