import { get } from 'lodash';
import { permissionTypes } from 'common';
import logger from '../config/logger';

const { projectKeyPermission, SYSTEM_INSTANCE_ADMIN } = permissionTypes;

const permissionDelim = ':';
const projectKey = 'project';

export function projectPermissionWrapper(permissionSuffix) {
  return (request, response, next) => {
    logger.debug('Auth: checking permissions');

    const requestedProject = get(request, 'params.projectKey') || get(request, 'body.projectKey');
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

    return response.status(401)
      .send({ message: `User missing expected permission: ${requiredProjectPermission} || ${SYSTEM_INSTANCE_ADMIN}` })
      .end();
  };
}

export function permissionWrapper(permissionSuffix) {
  const requiredProjectPermission = projectKey.concat(permissionDelim, permissionSuffix);

  return (request, response, next) => {
    const grantedPermissions = get(request, 'user.permissions') || [];

    logger.debug('Auth: checking permissions');
    logger.debug(`Auth: expected permission suffix: ${permissionSuffix}`);
    logger.debug(`Auth: expected permission: ${requiredProjectPermission} || ${SYSTEM_INSTANCE_ADMIN}`);
    logger.debug(`Auth: granted user permissions: ${grantedPermissions}`);

    if (grantedPermissions.includes(requiredProjectPermission) || grantedPermissions.includes(SYSTEM_INSTANCE_ADMIN)) {
      logger.debug('Auth: permission check: PASSED');
      next();
    } else {
      logger.warn('Auth: permission check: FAILED');
      response.status(401)
        .send({ message: `User missing expected permission: ${requiredProjectPermission} || ${SYSTEM_INSTANCE_ADMIN}` })
        .end();
    }
  };
}

export function systemAdminPermissionWrapper() {
  return (request, response, next) => {
    const grantedPermissions = get(request, 'user.permissions') || [];

    logger.debug('Auth: checking permissions');
    logger.debug(`Auth: expected permission: ${SYSTEM_INSTANCE_ADMIN}`);
    logger.debug(`Auth: granted user permissions: ${grantedPermissions}`);

    if (grantedPermissions.includes(SYSTEM_INSTANCE_ADMIN)) {
      logger.debug('Auth: permission check: PASSED');
      next();
    } else {
      logger.warn('Auth: permission check: FAILED');
      response.status(401)
        .send({ message: `User missing expected permission: ${SYSTEM_INSTANCE_ADMIN}` })
        .end();
    }
  };
}
