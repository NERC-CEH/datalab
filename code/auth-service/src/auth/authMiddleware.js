import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

const authMiddleware = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: 'https://mjbr.eu.auth0.com/.well-known/jwks.json',
  }),
  audience: 'https://datalab-api.datalabs.nerc.ac.uk/',
  issuer: 'https://mjbr.eu.auth0.com/',
  algorithms: ['RS256'],
  getToken: request => request.cookies.authorization,
});

export default authMiddleware;
