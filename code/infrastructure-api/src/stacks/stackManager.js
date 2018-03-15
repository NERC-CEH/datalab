import logger from 'winston';
import getStack from './stacks';

function createStack(params) {
  const { datalabInfo, name, type } = params;
  const stack = getStack(type);

  if (!stack) {
    logger.error(`Could not create stack. No stack definition for type ${type}`);
    return Promise.reject({ message: `No stack definition for type ${type}` });
  }

  logger.info(`Creating new ${type} stack with name: ${name} for datalab: ${datalabInfo.name}`);
  return stack.create(params);
}

function deleteStack(params) {
  const { datalabInfo, name, type } = params;
  const stack = getStack(type);

  if (!stack) {
    logger.error(`Could not delete stack. No stack definition for type ${type}`);
    return Promise.reject({ message: `No stack definition for type ${type}` });
  }

  logger.info(`Deleting stack ${name} for datalab: ${datalabInfo.name}`);
  return stack.delete(params);
}

export default { createStack, deleteStack };
