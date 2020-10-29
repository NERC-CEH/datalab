import jwt from 'express-jwt';
import logger from 'winston';
import authService from '../config/services';

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
  authService.retrievePermissionsToken(request.headers.identity.username, request.headers.authorization)
    .then((token) => {
      request.headers.authorization = `Bearer ${token}`;
      next();
    })
    .catch((err) => {
      logger.error(err.message);
      response.status(401).send({ message: 'Unauthorised' });
    });
};

export const verifyToken = jwt(authService.jwksVerifyConfig());
