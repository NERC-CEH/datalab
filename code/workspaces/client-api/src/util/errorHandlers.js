import { ApolloError } from 'apollo-server';
import logger from 'winston';
import { has } from 'lodash';

const axiosErrorHandler = message => (error) => {
  if (has(error, 'response.data.message')) {
    logger.error(error.response.data.message);
    throw new Error(`${message} ${error.response.data.message}`);
  }
  logger.error(error);
  throw new Error(`${message} ${error}`);
};

async function axiosErrorWrapper(message, fn, ...args) {
  try {
    return await fn(...args);
  } catch (error) {
    return handleAxiosError(message, error);
  }
}

function handleAxiosError(message, error) {
  const { response: { status, data } } = error;
  if (status === 401 || status === 403) {
    throw new ApolloError(data.errors, 'UNAUTHORISED');
  }
  axiosErrorHandler(message)(error);
}

function wrapWithAxiosErrorWrapper(message, fn) {
  return (...args) => axiosErrorWrapper(message, fn, ...args);
}

export { axiosErrorHandler, wrapWithAxiosErrorWrapper };
