import { get } from 'lodash';
import logger from 'winston';

const PROJECT = 'project';
const permissionDelim = ':';

function permissionChecker(permissionSuffixes) {
  const projectName = () => PROJECT;
  return checkPermissions(permissionSuffixes, projectName);
}

function projectPermissionChecker(permissionSuffixes) {
  const projectName = request => get(request, 'params.projectName');
  return checkPermissions(permissionSuffixes, projectName);
}

function checkPermissions(permissionSuffixes, projectNameFn) {
  return (request, response, next) => {
    const projectName = projectNameFn(request);
    if (!projectName) {
      logger.warn('Auth: permission check: FAILED');
      response.status(401);
      return response.send({ message: 'Request missing parameter: projectName' });
    }

    const requiredPermissions = permissionSuffixes.map(suffix => projectName.concat(permissionDelim, suffix));
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
