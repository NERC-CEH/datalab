import jwt from 'jsonwebtoken';
import { pem2jwk } from 'pem-jwk';
import { get } from 'lodash';
import logger from 'winston';
import { permissionTokenCounter } from '../config/metrics';
import userRolesRepository from '../dataaccess/userRolesRepository';
import getPermissions from '../permissions/permissions';
import {
  PRIVATE_KEY,
  PUBLIC_KEY,
  algorithm,
  audience,
  expiresIn,
  issuer,
  keyid,
} from '../config/auth';

function checkUser(request, response) {
  permissionTokenCounter.inc();

  if (!request.user) {
    response.status(401);
    return response.send({ message: `User not Authorised for domain ${request.headers.host}` });
  }

  return response.send({ message: `User Authorised for domain ${request.headers.host}` });
}

function getPermissionsForUser(request, response) {
  const userId = get(request, 'user.sub');

  return userRolesRepository.getRoles(userId)
    .then((userRoles) => {
      const permissions = getPermissions(userRoles);
      logger.debug(`getPermissionsForUser userId ${userId} permissions ${permissions}`);
      return response.json({ permissions });
    })
    .catch((err) => {
      logger.error(`Error retrieving roles for user ${userId}: ${err}`);
      response.status(500);
      return response.send({ message: err.message });
    });
}

function generatePermissionToken(request, response) {
  const userId = get(request, 'user.sub');

  return userRolesRepository.getRoles(userId)
    .then((userRoles) => {
      const permissions = getPermissions(userRoles);
      const payload = {
        sub: userId,
        roles: userRoles,
        permissions,
      };
      const options = { algorithm, audience, issuer, keyid, expiresIn };
      const token = jwt.sign(payload, PRIVATE_KEY, options);

      logger.debug('Responding with internal token');
      logger.debug(`Roles: ${JSON.stringify(userRoles)}`);
      logger.debug(`Permissions: ${JSON.stringify(permissions)}`);
      return response.send({ token });
    })
    .catch((err) => {
      logger.error(`Error retrieving roles for user ${userId}: ${err}`);
      response.status(500);
      return response.send({ message: err.message });
    });
}

/**
 * Construct the JWKS array to allow clients to retrieve the JWT public signing key
 * https://tools.ietf.org/id/draft-ietf-jose-json-web-key-41.txt
 * https://www.npmjs.com/package/pem-jwk
 * @param request
 * @param response
 */
function serveJWKS(request, response) {
  const jwk = {
    ...pem2jwk(PUBLIC_KEY),
    kid: keyid,
    use: 'sig',
  };

  return response.send({ keys: [jwk] });
}

export default { checkUser, getPermissionsForUser, generatePermissionToken, serveJWKS };
