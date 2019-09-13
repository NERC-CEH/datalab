import logger from 'winston';
import { permissionTypes } from 'common';

const { SYSTEM_INSTANCE_ADMIN, PROJECT, delimiter } = permissionTypes;

export const permissionWrapper = (permissionSuffix, ...rest) => permissionCheck(
  [
    PROJECT.concat(delimiter, permissionSuffix),
    SYSTEM_INSTANCE_ADMIN,
  ],
  ...rest,
);

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
