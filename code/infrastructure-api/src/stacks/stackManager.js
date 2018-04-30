import logger from 'winston';
import Stacks from './Stacks';
import stackRepository from '../dataaccess/stacksRepository';
import { REQUESTED } from '../models/stack.model';

function createStack(user, params) {
  const { datalabInfo, name, type } = params;
  const stack = Stacks.getStack(type);

  if (!stack) {
    logger.error(`Could not create stack. No stack definition for type ${type}`);
    return Promise.reject({ message: `No stack definition for type ${type}` });
  }

  logger.info(`Creating new ${type} stack with name: ${name} for datalab: ${datalabInfo.name}`);
  return stack.create(params)
    .then(response => stackRepository.createOrUpdate(
      user,
      {
        ...params,
        category: stack.category,
        status: REQUESTED,
        url: `https://${datalabInfo.name}-${name}.${datalabInfo.domain}`,
        internalEndpoint: `http://${params.type}-${name}`,
      })
      .then(() => response));
}

function deleteStack(user, params) {
  const { datalabInfo, name, type } = params;
  const stack = Stacks.getStack(type);

  if (!stack) {
    logger.error(`Could not delete stack. No stack definition for type ${type}`);
    return Promise.reject({ message: `No stack definition for type ${type}` });
  }

  logger.info(`Deleting stack ${name} for datalab: ${datalabInfo.name}`);
  return stack.delete(params)
    .then(response => stackRepository.deleteStack(user, params)
      .then(() => response));
}

export default { createStack, deleteStack };
