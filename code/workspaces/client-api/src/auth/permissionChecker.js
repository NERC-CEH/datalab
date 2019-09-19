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

/*
Note, 'done' here is nothing to do with the Express middleware, it is simply a call to the data access function providing the data promise.
*/
export function projectPermissionWrapper(args, permissionSuffix, user, done) {
  if (!args.projectKey) {
    logger.error('Auth: permission check: FAILED, projectKey not passed in args');
    return Promise.reject(new Error(`projectKey not passed, expected suffix: ${permissionSuffix}`));
  }

  return permissionCheck(
    [
      args.projectKey.concat(delimiter, permissionSuffix),
      SYSTEM_INSTANCE_ADMIN,
    ],
    user,
    done,
  );
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

function permissionCheck(requiredPermissions, { permissions }, done) {
  const grantedPermissions = permissions || [];

  logger.debug('Auth: checking permissions');
  logger.debug(`Auth: expected permission(s): ${requiredPermissions}`);
  logger.debug(`Auth: granted user permission(s): ${grantedPermissions}`);

  if (!arraysIncludes(requiredPermissions, grantedPermissions)) {
    logger.warn('Auth: permission check: FAILED');
    return Promise.reject(new Error(`User missing expected permission(s): ${requiredPermissions}`));
  }

  logger.debug('Auth: permission check: PASSED');
  return done();
}

const arraysIncludes = (current, expected) => current.some(currentValue => expected.some(expectedValue => (currentValue.match(expectedValue) || []).length > 0));

export default permissionWrapper;
