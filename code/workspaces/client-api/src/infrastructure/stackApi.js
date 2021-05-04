import logger from 'winston';
import stackService from '../dataaccess/stackService';
import { axiosErrorHandler } from '../util/errorHandlers';

const createStack = (context, stack) => createStackPayloadGenerator(stack)
  .then(logPayload('creation'))
  .then(sendCreationRequest(context))
  .catch(axiosErrorHandler('Unable to create stack'));

const createStackPayloadGenerator = stack => (Promise.resolve({
  ...stack,
  isPublic: true,
}));

const sendCreationRequest = context => stackPayload => stackService.createStack(stackPayload.projectKey, stackPayload, context)
  .then(response => response);

const deleteStack = (context, stack) => deleteStackPayloadGenerator(stack)
  .then(logPayload('deletion'))
  .then(sendDeletionRequest(context))
  .catch(axiosErrorHandler('Unable to delete stack'));

const deleteStackPayloadGenerator = stack => (Promise.resolve({
  ...stack,
}));

const sendDeletionRequest = context => stackPayload => stackService.deleteStack(stackPayload.projectKey, stackPayload, context)
  .then(response => response);

const updateStack = (context, stack) => updateStackPayloadGenerator(stack)
  .then(logPayload('update'))
  .then(sendUpdateRequest(context))
  .catch(axiosErrorHandler('Unable to update stack'));

const updateStackPayloadGenerator = stack => (Promise.resolve({
  ...stack,
  isPublic: true,
}));

const sendUpdateRequest = context => stackPayload => stackService.updateStack(stackPayload.projectKey, stackPayload, context)
  .then(response => response);

const restartStack = (context, stack) => restartStackPayloadGenerator(stack)
  .then(logPayload('restart'))
  .then(sendRestartRequest(context))
  .catch(axiosErrorHandler('Unable to restart stack'));

const restartStackPayloadGenerator = stack => (Promise.resolve({
  ...stack,
}));

const sendRestartRequest = context => stackPayload => stackService.restartStack(stackPayload.projectKey, stackPayload, context)
  .then(response => response);

const logPayload = protocolName => (payload) => {
  logger.info(`Requesting stack ${protocolName} request for ${payload.name}`);
  logger.debug(`${protocolName} request payload: ${JSON.stringify(payload)}`);
  return payload;
};

export default { createStack, deleteStack, updateStack, restartStack };
