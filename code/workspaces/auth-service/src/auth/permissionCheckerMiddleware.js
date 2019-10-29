import { get } from 'lodash';
import logger from 'winston';
import { permissionTypes } from 'common';

const { SYSTEM_INSTANCE_ADMIN, projectKeyPermission } = permissionTypes;

// Catch input arguments into an array for supporting multiple permissions
const permissionChecker = (...requiredPermissions) => (request, response, next) => (
  checkPermissions(requiredPermissions, request, response, next)
);

// Catch input arguments into an array for supporting multiple permissions
const projectPermissionChecker = (...requiredPermissions) => (request, response, next) => {
  const projectKey = get(request, 'params.projectKey');

  if (!projectKey) {
    logger.warn('Auth: permission check: FAILED');
    response.status(401);
    return response.send({ message: 'Request missing parameter: projectKey' });
  }

  const permissionsWithProjectKey = requiredPermissions.map(permission => projectKeyPermission(permission, projectKey));

  return checkPermissions(permissionsWithProjectKey, request, response, next);
};

const checkPermissions = (requiredPermissionsIn, request, response, next) => {
  const requiredPermissions = [...requiredPermissionsIn, SYSTEM_INSTANCE_ADMIN];
  const userPermissions = get(request, 'user.permissions', []);

  logger.debug('Auth: checking permissions');
  logger.debug(`Auth: required permission(s): ${requiredPermissions}`);
  logger.debug(`Auth: granted user permission(s): ${userPermissions}`);

  if (!userHasPermission(requiredPermissions, userPermissions)) {
    logger.warn('Auth: permission check: FAILED');
    response.status(401);
    return response.send({ message: `User missing required permission(s): ${requiredPermissions}` });
  }

  logger.debug('Auth: permission check: PASSED');
  return next();
};

const userHasPermission = (requiredPermissions, userPermissions) => requiredPermissions.some(value => userPermissions.includes(value));

export { permissionChecker, projectPermissionChecker };
