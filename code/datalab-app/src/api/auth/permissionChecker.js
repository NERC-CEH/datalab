import logger from 'winston';
import { permissionTypes } from '../../shared';

const { PROJECT, delimiter } = permissionTypes;

export const permissionWrapper = (permissionSuffix, ...rest) =>
  permissionCheck(
    [PROJECT.concat(delimiter, permissionSuffix)],
    ...rest);

export const multiPermissionsWrapper = (permissionSuffixes, ...rest) =>
  permissionCheck(
    permissionSuffixes.map(suffix => PROJECT.concat(delimiter, suffix)),
    ...rest);

function permissionCheck(requiredPermissions, { permissions }, next) {
  const grantedPermissions = permissions || [];

  logger.info('Auth: checking permissions');
  logger.debug(`Auth: expected permission(s): ${requiredPermissions}`);
  logger.debug(`Auth: granted user permission(s): ${grantedPermissions}`);

  if (!arraysIncludes(requiredPermissions, grantedPermissions)) {
    logger.warn('Auth: permission check: FAILED');
    return Promise.reject(new Error(`User missing expected permission(s): ${requiredPermissions}`));
  }

  logger.info('Auth: permission check: PASSED');
  return next();
}

const arraysIncludes = (current, expected) =>
  current.some(currentValue =>
    expected.some(expectedValue =>
      (currentValue.match(expectedValue) || []).length > 0));

export default permissionWrapper;
