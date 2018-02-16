import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import logger from 'winston';
import chalk from 'chalk';
import config from '../config/config';

const JWKS_URL = `${config.get('authorisationService')}/jwks`;

const baseConfig = {
  audience: 'https://api.datalabs.nerc.ac.uk/',
  issuer: 'https://authorisation.datalabs.nerc.ac.uk/',
};

function getAuthImplementation() {
  if (config.get('authorisationServiceStub')) {
    logger.info(chalk.red('Using Stub Authorisation Token'));

    return {
      ...baseConfig,
      secret: 'secret',
    };
  }

  return {
    ...baseConfig,
    algorithms: ['RS256'],
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 10,
      jwksUri: JWKS_URL,
    }),
  };
}

export default jwt(getAuthImplementation());
