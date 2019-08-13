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

export default axiosErrorHandler;
