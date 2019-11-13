import logger from '../config/logger';
import config from '../config/config';
import Stacks from './Stacks';
import stackRepository from '../dataaccess/stacksRepository';
import { status } from '../models/stackEnums';

function createStack(user, params) {
  const { projectKey, name, type } = params;
  const stack = Stacks.getStack(type);

  if (!stack) {
    logger.error(`Could not create stack. No stack definition for type ${type}`);
    return Promise.reject({ message: `No stack definition for type ${type}` });
  }

  logger.info(`Creating new ${type} stack with name: ${name} for project: ${projectKey}`);
  return stack.create(params)
    .then(response => stackRepository.createOrUpdate(
      projectKey,
      user,
      {
        ...params,
        category: stack.category,
        status: status.REQUESTED,
        url: `https://${projectKey}-${name}.${config.get('datalabDomain')}`,
        internalEndpoint: `http://${params.type}-${name}.${projectKey}`,
      },
    )
      .then(() => response));
}

function deleteStack(user, params) {
  const { projectKey, name, type } = params;
  const stack = Stacks.getStack(type);

  if (!stack) {
    logger.error(`Could not delete stack. No stack definition for type ${type}`);
    return Promise.reject({ message: `No stack definition for type ${type}` });
  }

  logger.info(`Deleting stack ${name} for project: ${projectKey}`);
  return stack.delete(params)
    .then(response => stackRepository.deleteStack(projectKey, user, params)
      .then(() => response));
}

export default { createStack, deleteStack };
