import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import axios from 'axios';
import logger from 'winston';
import config from '../config';

const AUTHORISATION_URL = `${config.get('authorisationService')}/authorise`;
const JWKS_URL = `${config.get('authorisationService')}/jwks`;

/**
 * Authorisation middleware - This passes the Auth0 access_token and exchanges
 * for an internal access token containing user permissions.
 * The token is replaced in the request headers allowing the downstream middleware
 * to then validate the token and extract the user name and roles making them
 * available to the GraphQL resolvers.
 * @param request
 * @param response
 * @param next
 */
export const authorise = (request, response, next) => {
  const options = {
    headers: {
      authorization: request.headers.authorization,
    },
  };

  axios.get(AUTHORISATION_URL, options)
    .then((data) => {
      request.headers.authorization = `Bearer ${data.data.token}`;
      next();
    }).catch((err) => {
      logger.log(err);
      response.status(401).send({ message: 'Unauthorised' });
    });
};

export const verifyToken = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10,
    jwksUri: JWKS_URL,
  }),
  audience: 'https://api.datalabs.nerc.ac.uk/',
  issuer: 'https://authorisation.datalabs.nerc.ac.uk/',
  algorithms: ['RS256'],
});
