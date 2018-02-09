/**
 * Dependency injection container to allow run time configuration for service implementations based
 * on configuration parameters.
 *
 * By default the real implementations are used.
 */
import logger from 'winston';
import chalk from 'chalk';
import config from '../config';

import authServiceClient from '../auth/authServiceClient';
import authServiceStub from '../auth/authServiceStub';

function getAuthImplementation() {
  if (config.get('authorisationServiceStub')) {
    logger.info(chalk.red('Using Stub Authorisation Service'));
    return authServiceStub;
  }
  return authServiceClient;
}

const authService = getAuthImplementation();

export default authService;
