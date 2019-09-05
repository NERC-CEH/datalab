import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import chalk from 'chalk';
import logger from '../config/logger';
import config from '../config/config';

const JWKS_URL = `${config.get('authorisationService')}/jwks`;

const baseConfig = {
  audience: config.get('authorisationAudience'),
  issuer: config.get('authorisationIssuer'),
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
