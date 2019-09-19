import { get } from 'lodash';
import logger from '../config/logger';

const permissionDelim = ':';
const projectKey = 'project';

const SYSTEM_ADMIN = 'system:instance:admin';

function permissionWrapper(permissionSuffix) {
  const requiredProjectPermission = projectKey.concat(permissionDelim, permissionSuffix);

  return (request, response, next) => {
    const grantedPermissions = get(request, 'user.permissions') || [];

    logger.debug('Auth: checking permissions');
    logger.debug(`Auth: expected permission suffix: ${permissionSuffix}`);
    logger.debug(`Auth: expected permission: ${requiredProjectPermission} || ${SYSTEM_ADMIN}`);
    logger.debug(`Auth: granted user permissions: ${grantedPermissions}`);

    if (grantedPermissions.includes(requiredProjectPermission) || grantedPermissions.includes(SYSTEM_ADMIN)) {
      logger.debug('Auth: permission check: PASSED');
      next();
    } else {
      logger.warn('Auth: permission check: FAILED');
      response.status(401)
        .send({ message: `User missing expected permission: ${requiredProjectPermission} || ${SYSTEM_ADMIN}` })
        .end();
    }
  };
}

export default permissionWrapper;
