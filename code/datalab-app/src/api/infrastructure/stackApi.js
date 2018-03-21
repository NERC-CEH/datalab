import logger from 'winston/lib/winston';
import datalabRepository from '../dataaccess/datalabRepository';
import stackRepository from '../dataaccess/stackRepository';
import axiosErrorHandler from '../util/errorHandlers';

const createStack = (context, datalabName, stack) =>
  datalabRepository.getByName(context.user, datalabName)
    .then(createStackPayloadGenerator(stack))
    .then(logPayload('creation'))
    .then(sendCreationRequest(context))
    .catch(axiosErrorHandler('Unable to create stack'));

const createStackPayloadGenerator = stack => datalabInfo => ({
  datalabInfo,
  name: stack.name,
  type: stack.type,
  sourcePath: stack.sourcePath,
  isPublic: true,
  volumeMount: stack.volumeMount,
});

const sendCreationRequest = context => stackPayload =>
  stackRepository.createStack(context, stackPayload)
    .then(response => response);

const deleteStack = (context, datalabName, stack) =>
  datalabRepository.getByName(context.user, datalabName)
    .then(deleteStackPayloadGenerator(stack))
    .then(logPayload('deletion'))
    .then(sendDeletionRequest(context))
    .catch(axiosErrorHandler('Unable to delete stack'));

const deleteStackPayloadGenerator = stack => datalabInfo => ({
  datalabInfo,
  name: stack.name,
  type: stack.type,
});

const sendDeletionRequest = context => stackPayload =>
  stackRepository.deleteStack(context, stackPayload)
    .then(response => response);

const logPayload = protocolName => (payload) => {
  logger.info(`Requesting stack ${protocolName} request for ${payload.name}`);
  logger.debug(`${protocolName} request payload: ${JSON.stringify(payload)}`);
  return payload;
};

export default { createStack, deleteStack };
