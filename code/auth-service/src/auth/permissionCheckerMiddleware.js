import { get } from 'lodash';
import logger from 'winston';

const PROJECT = 'project';
const permissionDelim = ':';

function permissionWrapper(permissionSuffixes) {
  const requiredPermissions = permissionSuffixes.map(suffix => PROJECT.concat(permissionDelim, suffix));

  return (request, response, next) => {
    const grantedPermissions = get(request, 'user.permissions') || [];

    logger.info('Auth: checking permissions');
    logger.debug(`Auth: expected permission(s): ${requiredPermissions}`);
    logger.debug(`Auth: granted user permission(s): ${grantedPermissions}`);

    if (!arraysIncludes(requiredPermissions, grantedPermissions)) {
      logger.warn('Auth: permission check: FAILED');
      response.status(401);
      return response.send({ message: `User missing expected permission(s): ${requiredPermissions}` });
    }

    logger.info('Auth: permission check: PASSED');
    return next();
  };
}

const arraysIncludes = (current, expected) =>
  current.some(currentValue =>
    expected.some(expectedValue =>
      new RegExp(`^${currentValue}$`).test(expectedValue)));

export default permissionWrapper;
