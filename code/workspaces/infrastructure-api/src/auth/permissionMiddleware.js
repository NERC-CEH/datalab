import { get } from 'lodash';
import { permissionTypes } from 'common';
import logger from '../config/logger';
import systemPermissionMiddleware from './subPermissionMiddleware/systemPermissionMiddleware';
import projectPermissionMiddleware from './subPermissionMiddleware/projectPermissionMiddleware';
import { ensurePermissionGrantedMiddleware, initRequestPermissionInfoStructureMiddleware } from './subPermissionMiddleware/utils';

const { projectKeyPermission, SYSTEM_INSTANCE_ADMIN, SYSTEM_DATA_MANAGER } = permissionTypes;

export function projectPermissionWrapper(permissionSuffix) {
  return (request, response, next) => {
    logger.debug('Auth: checking permissions');

    const requestedProject = get(request, 'params.projectKey')
      || get(request, 'body.projectKey')
      || get(request, 'query.projectKey');
    const grantedPermissions = get(request, 'user.permissions') || [];

    if (!requestedProject) {
      logger.warn('Auth: permission check: FAILED');
      return response.status(400).send({ message: "'projectKey' must be defined in either URL or request body when using project permission wrapper." });
    }
    const requiredProjectPermission = projectKeyPermission(permissionSuffix, requestedProject);

    logger.debug(`Auth: expected user permission: ${requiredProjectPermission}`);
    logger.debug(`Auth: granted user permissions: ${grantedPermissions}`);
    logger.debug(`Auth: expected permission: ${requiredProjectPermission} || ${SYSTEM_INSTANCE_ADMIN}`);

    if (grantedPermissions.includes(requiredProjectPermission) || grantedPermissions.includes(SYSTEM_INSTANCE_ADMIN)) {
      logger.debug('Auth: permission check: PASSED');
      return next();
    }

    return response
      .status(401)
      .send({ message: `User missing expected permission: ${requiredProjectPermission} || ${SYSTEM_INSTANCE_ADMIN}` });
  };
}

export function permissionWrapper(requiredPermission, allowInstanceAdmin = true) {
  const acceptedPermissions = [requiredPermission];
  if (allowInstanceAdmin) acceptedPermissions.push(SYSTEM_INSTANCE_ADMIN);

  return (request, response, next) => {
    const grantedPermissions = get(request, 'user.permissions') || [];

    logger.debug('Auth: checking permissions');
    logger.debug(`Auth: accepted permission: ${acceptedPermissions}`);
    logger.debug(`Auth: granted user permissions: ${grantedPermissions}`);

    if (acceptedPermissions.some(acceptedPermission => grantedPermissions.includes(acceptedPermission))) {
      logger.debug('Auth: permission check: PASSED');
      return next();
    }
    logger.warn('Auth: permission check: FAILED');
    return response.status(401)
      .send({ message: `User missing acceptable permission: ${acceptedPermissions}` });
  };
}

export function systemAdminPermissionWrapper() {
  return permissionWrapper(SYSTEM_INSTANCE_ADMIN, false);
}

export function systemDataManagerPermissionWrapper() {
  return permissionWrapper(SYSTEM_DATA_MANAGER, false);
}

function permissionMiddleware(...acceptedPermissions) {
  // Currently instance admin can do everything on system
  acceptedPermissions.push(SYSTEM_INSTANCE_ADMIN);

  // array of objects containing
  // getPermissionsHandled: function that takes list of permissions and filters to
  //    return array of permissions that the middleware will handle
  // getMiddleware: function that takes list of permissions and returns a middleware
  //    function configured to check those permissions
  const permissionMiddlewares = [
    systemPermissionMiddleware,
    projectPermissionMiddleware,
  ];

  return [
    // Must be first - adds information to the incoming request used by the following middleware
    initRequestPermissionInfoStructureMiddleware,
    ...permissionMiddlewares
      // remove middleware that won't be handling any requests based on the permissions they handle
      .filter(({ getPermissionsHandled }) => getPermissionsHandled(acceptedPermissions).length > 0)
      // get middleware configured to check the permissions it can handle
      .map(
        ({ getPermissionsHandled, getMiddleware }) => getMiddleware(getPermissionsHandled(acceptedPermissions)),
      ),
    // Must be last - ensures that one of the middleware functions has granted permission
    ensurePermissionGrantedMiddleware,
  ];
}

export default permissionMiddleware;
