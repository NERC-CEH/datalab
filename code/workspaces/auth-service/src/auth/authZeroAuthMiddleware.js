import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import config from '../config/config';

const secretStrategy = jwksRsa.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10,
  jwksUri: `https://${config.get('authZeroDomain')}/.well-known/jwks.json`,
});

const baseConfig = {
  secret: secretStrategy,
  audience: config.get('authZeroAudience'),
  issuer: `https://${config.get('authZeroDomain')}/`,
  algorithms: ['RS256'],
};

export const cookieAuthMiddleware = jwt({
  ...baseConfig,
  getToken: request => request.cookies.authorization,
});

export const tokenAuthMiddleware = jwt(baseConfig);
