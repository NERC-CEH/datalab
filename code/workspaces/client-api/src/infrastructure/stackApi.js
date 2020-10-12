import logger from 'winston';
import datalabRepository from '../dataaccess/datalabRepository';
import stackService from '../dataaccess/stackService';
import axiosErrorHandler from '../util/errorHandlers';

const createStack = (context, datalabName, stack) => datalabRepository.getByName(context.user, datalabName)
  .then(createStackPayloadGenerator(stack))
  .then(logPayload('creation'))
  .then(sendCreationRequest(context))
  .catch(axiosErrorHandler('Unable to create stack'));

const createStackPayloadGenerator = stack => datalabInfo => ({
  datalabInfo,
  ...stack,
  isPublic: true,
});

const sendCreationRequest = context => stackPayload => stackService.createStack(stackPayload.projectKey, stackPayload, context)
  .then(response => response);

const deleteStack = (context, datalabName, stack) => datalabRepository.getByName(context.user, datalabName)
  .then(deleteStackPayloadGenerator(stack))
  .then(logPayload('deletion'))
  .then(sendDeletionRequest(context))
  .catch(axiosErrorHandler('Unable to delete stack'));

const deleteStackPayloadGenerator = stack => datalabInfo => ({
  datalabInfo,
  ...stack,
});

const sendDeletionRequest = context => stackPayload => stackService.deleteStack(stackPayload.projectKey, stackPayload, context)
  .then(response => response);

const updateStack = (context, datalabName, stack) => datalabRepository.getByName(context.user, datalabName)
  .then(updateStackPayloadGenerator(stack))
  .then(logPayload('update'))
  .then(sendUpdateRequest(context))
  .catch(axiosErrorHandler('Unable to update stack'));

const updateStackPayloadGenerator = stack => datalabInfo => ({
  datalabInfo,
  ...stack,
  isPublic: true,
});

const sendUpdateRequest = context => stackPayload => stackService.updateStack(stackPayload.projectKey, stackPayload, context)
  .then(response => response);

const restartStack = (context, datalabName, stack) => datalabRepository.getByName(context.user, datalabName)
  .then(restartStackPayloadGenerator(stack))
  .then(logPayload('restart'))
  .then(sendRestartRequest(context))
  .catch(axiosErrorHandler('Unable to restart stack'));

const restartStackPayloadGenerator = stack => datalabInfo => ({
  datalabInfo,
  ...stack,
});

const sendRestartRequest = context => stackPayload => stackService.restartStack(stackPayload.projectKey, stackPayload, context)
  .then(response => response);

const logPayload = protocolName => (payload) => {
  logger.info(`Requesting stack ${protocolName} request for ${payload.name}`);
  logger.debug(`${protocolName} request payload: ${JSON.stringify(payload)}`);
  return payload;
};

export default { createStack, deleteStack, updateStack, restartStack };
