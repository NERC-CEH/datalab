import logger from 'winston';
import { permissionTypes } from 'common';
import userService from '../dataaccess/usersService';

const { SYSTEM_INSTANCE_ADMIN, PROJECT, delimiter } = permissionTypes;

export const permissionWrapper = (permissionSuffix, ...rest) => permissionCheck(
  [
    PROJECT.concat(delimiter, permissionSuffix),
    SYSTEM_INSTANCE_ADMIN,
  ],
  ...rest,
);

export function projectPermissionWrapper(projectKey, permissionSuffix, token, user, next) {
  return userService.isMemberOfProject(projectKey, token)
    .then((accessible) => {
      if (!accessible) {
        logger.warn('Auth: permission check: FAILED');
        return Promise.reject(new Error(`Requested projectKey ${projectKey} not accessible to user`));
      }

      return permissionCheck(
        [
          PROJECT.concat(delimiter, permissionSuffix),
          SYSTEM_INSTANCE_ADMIN,
        ],
        user,
        next,
      );
    });
}

export const multiPermissionsWrapper = (permissionSuffixes, ...rest) => permissionCheck(
  [
    ...permissionSuffixes.map(suffix => PROJECT.concat(delimiter, suffix)),
    SYSTEM_INSTANCE_ADMIN,
  ],
  ...rest,
);

export const instanceAdminWrapper = (...rest) => permissionCheck(
  [SYSTEM_INSTANCE_ADMIN],
  ...rest,
);

function permissionCheck(requiredPermissions, { permissions }, next) {
  const grantedPermissions = permissions || [];

  logger.debug('Auth: checking permissions');
  logger.debug(`Auth: expected permission(s): ${requiredPermissions}`);
  logger.debug(`Auth: granted user permission(s): ${grantedPermissions}`);

  if (!arraysIncludes(requiredPermissions, grantedPermissions)) {
    logger.warn('Auth: permission check: FAILED');
    return Promise.reject(new Error(`User missing expected permission(s): ${requiredPermissions}`));
  }

  logger.debug('Auth: permission check: PASSED');
  return next();
}

const arraysIncludes = (current, expected) => current.some(currentValue => expected.some(expectedValue => (currentValue.match(expectedValue) || []).length > 0));

export default permissionWrapper;
