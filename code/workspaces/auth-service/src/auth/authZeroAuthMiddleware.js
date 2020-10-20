import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import config from '../config/config';
import getOidcConfig from '../config/oidcConfig';

const getSecretStrategy = async () => {
  const oidcConfig = await getOidcConfig();
  return jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: oidcConfig.jwks_uri,
  });
};

const getBaseConfig = async () => {
  const oidcConfig = await getOidcConfig();
  const secret = await getSecretStrategy();

  return {
    secret,
    audience: config.get('oidcProviderAudience'),
    issuer: oidcConfig.issuer,
    algorithms: ['RS256'],
  };
};

export const cookieAuthMiddleware = async (req, res, next) => {
  const baseConfig = await getBaseConfig();
  return jwt({
    ...baseConfig,
    getToken: request => request.cookies.authorization,
  })(req, res, next);
};

export const tokenAuthMiddleware = async (req, res, next) => {
  const baseConfig = await getBaseConfig();
  return jwt(baseConfig)(req, res, next);
};
