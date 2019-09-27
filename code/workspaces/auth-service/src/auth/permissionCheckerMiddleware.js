import { get } from 'lodash';
import logger from 'winston';
import { permissionTypes } from 'common';

const { SYSTEM_INSTANCE_ADMIN } = permissionTypes;

const PROJECT = 'project';
const permissionDelim = ':';

function permissionChecker(permissionSuffixes) {
  const projectKey = () => PROJECT;
  return checkPermissions(permissionSuffixes, projectKey);
}

function projectPermissionChecker(permissionSuffixes) {
  const projectKey = request => get(request, 'params.projectKey');
  return checkPermissions(permissionSuffixes, projectKey);
}

function checkPermissions(permissionSuffixes, projectNameFn) {
  return (request, response, next) => {
    const projectKey = projectNameFn(request);
    if (!projectKey) {
      logger.warn('Auth: permission check: FAILED');
      response.status(401);
      return response.send({ message: 'Request missing parameter: projectKey' });
    }

    const requiredPermissions = permissionSuffixes
      .map(suffix => projectKey.concat(permissionDelim, suffix))
      .concat(SYSTEM_INSTANCE_ADMIN);
    const grantedPermissions = get(request, 'user.permissions') || [];

    logger.debug('Auth: checking permissions');
    logger.debug(`Auth: expected permission(s): ${requiredPermissions}`);
    logger.debug(`Auth: granted user permission(s): ${grantedPermissions}`);

    if (!arraysIncludes(requiredPermissions, grantedPermissions)) {
      logger.warn('Auth: permission check: FAILED');
      response.status(401);
      return response.send({ message: `User missing expected permission(s): ${requiredPermissions}` });
    }

    logger.debug('Auth: permission check: PASSED');
    return next();
  };
}

const arraysIncludes = (current, expected) => current.some(currentValue => expected.some(expectedValue => new RegExp(`^${currentValue}$`).test(expectedValue)));

export { permissionChecker, projectPermissionChecker };
