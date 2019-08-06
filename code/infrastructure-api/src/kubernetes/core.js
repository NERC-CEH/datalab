import logger from '../config/logger';
import { has, get } from 'lodash';

export const handleCreateError = (type, name) => (error) => {
  if (has(error, 'response.data.message')) {
    logger.error(`Kubernetes API: Unable to create ${type}: '${name}' - ${error.response.data.message}`);
    throw createError(`Unable to create kubernetes ${type} '${name}' - ${error.response.data.message}`);
  }

  logger.error(`unable to create kubernetes ${type} '${name}' - ${error}`);
  throw createError(`unable to create kubernetes ${type} '${name}' - ${error}`);
};

export const handleDeleteError = (type, name) => (error) => {
  if (has(error, 'response.status') && get(error, 'response.status') === 404) {
    logger.warn(`Kubernetes API: Could not find ${type}: ${name} to delete it`);
    return Promise.resolve();
  }

  logger.error(`Error deleting ${type}: ${name}`);
  throw createError(error.message);
};

function createError(message) {
  return new Error(`Kubernetes API: ${message}`);
}
