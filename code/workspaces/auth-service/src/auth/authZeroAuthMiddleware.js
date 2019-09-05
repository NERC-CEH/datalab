import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import config from '../config/config';

const secretStrategy = jwksRsa.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10,
  jwksUri: 'https://mjbr.eu.auth0.com/.well-known/jwks.json',
});

const baseConfig = {
  secret: secretStrategy,
  audience: config.get('authZeroAudience'),
  issuer: 'https://mjbr.eu.auth0.com/',
  algorithms: ['RS256'],
};

export const cookieAuthMiddleware = jwt({
  ...baseConfig,
  getToken: request => request.cookies.authorization,
});

export const tokenAuthMiddleware = jwt(baseConfig);
