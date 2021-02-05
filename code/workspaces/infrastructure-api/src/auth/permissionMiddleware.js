import { get } from 'lodash';
import { permissionTypes } from 'common';
import logger from '../config/logger';

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
