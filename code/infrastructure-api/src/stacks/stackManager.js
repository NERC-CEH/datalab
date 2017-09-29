import logger from 'winston';
import getStack from './stacks';

function createStack(datalabInfo, name, type) {
  const stack = getStack(type);

  if (!stack) {
    logger.error(`Could not create stack. No stack definition for type ${type}`);
    return Promise.reject({ message: `No stack definition for type ${type}` });
  }

  logger.info(`Creating new ${type} stack with name: ${name} for datalab: ${datalabInfo.name}`);
  return stack.create(datalabInfo, name, type);
}

function deleteStack(datalabInfo, name, type) {
  const stack = getStack(type);

  if (!stack) {
    logger.error(`Could not delete stack. No stack definition for type ${type}`);
    return Promise.reject({ message: `No stack definition for type ${type}` });
  }

  logger.info(`Deleting stack ${name} for datalab: ${datalabInfo.name}`);
  return stack.delete(datalabInfo, name, type);
}

export default { createStack, deleteStack };
