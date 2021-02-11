import logger from 'winston';
import { permissionTypes } from 'common';

const { SYSTEM_INSTANCE_ADMIN, SYSTEM_DATA_MANAGER, delimiter, PROJECT_NAMESPACE } = permissionTypes;

export const permissionWrapper = (permissionSuffix, ...rest) => permissionCheck(
  [
    permissionSuffix,
    SYSTEM_INSTANCE_ADMIN,
  ],
  ...rest,
);

/*
Note, 'done' here is nothing to do with the Express middleware, it is simply a call to the data access function providing the data promise.
*/
export function projectPermissionWrapper(args, permissionSuffix, user, done) {
  if (!args.projectKey) {
    logger.error(`Auth: permission check: FAILED, projectKey not passed in args, expected suffix: ${permissionSuffix}`);
    return Promise.reject(new Error(`projectKey not passed, expected suffix: ${permissionSuffix}`));
  }

  let permissions = permissionSuffix;
  if (!Array.isArray(permissionSuffix)) {
    permissions = [permissionSuffix];
  }

  return permissionCheck(
    [
      ...permissions.map(suffix => PROJECT_NAMESPACE.concat(delimiter, args.projectKey, delimiter, suffix)),
      SYSTEM_INSTANCE_ADMIN,
    ],
    user,
    done,
  );
}

export const multiPermissionsWrapper = (permissionSuffixes, ...rest) => permissionCheck(
  [
    ...permissionSuffixes,
    SYSTEM_INSTANCE_ADMIN,
  ],
  ...rest,
);

export const instanceAdminWrapper = (...rest) => permissionCheck(
  [SYSTEM_INSTANCE_ADMIN],
  ...rest,
);

function permissionCheck(requiredPermissions, { permissions }, done) {
  const userPermissions = permissions || [];

  logger.debug('Auth: checking permissions');
  logger.debug(`Auth: expected permission(s): ${requiredPermissions}`);
  logger.debug(`Auth: granted user permission(s): ${userPermissions}`);

  if (!userHasPermission(requiredPermissions, userPermissions)) {
    logger.warn('Auth: permission check: FAILED');
    return Promise.reject(new Error(`User missing expected permission(s): ${requiredPermissions}`));
  }

  logger.debug('Auth: permission check: PASSED');
  return done();
}

const userHasPermission = (requiredPermissions, userPermissions) => requiredPermissions.some(value => userPermissions.includes(value));
