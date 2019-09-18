import { get } from 'lodash';
import logger from '../config/logger';

const permissionDelim = ':';
const projectName = 'project';
const systemName = 'system';

function permissionWrapper(permissionSuffix) {
  const requiredProjectPermission = projectName.concat(permissionDelim, permissionSuffix);
  const requiredSystemPermissions = systemName.concat(permissionDelim, permissionSuffix);

  return (request, response, next) => {
    const grantedPermissions = get(request, 'user.permissions') || [];

    logger.debug('Auth: checking permissions');
    logger.debug(`Auth: expected permission suffix: ${permissionSuffix}`);
    logger.debug(`Auth: expected permission: ${requiredProjectPermission} || ${requiredSystemPermissions}`);
    logger.debug(`Auth: granted user permissions: ${grantedPermissions}`);

    if (grantedPermissions.includes(requiredProjectPermission) || grantedPermissions.includes(requiredSystemPermissions)) {
      logger.debug('Auth: permission check: PASSED');
      next();
    } else {
      logger.warn('Auth: permission check: FAILED');
      response.status(401)
        .send({ message: `User missing expected permission: ${requiredProjectPermission} || ${requiredSystemPermissions}` })
        .end();
    }
  };
}

export default permissionWrapper;
