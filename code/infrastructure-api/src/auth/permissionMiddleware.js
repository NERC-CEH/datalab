import { get } from 'lodash';
import logger from 'winston';
import config from '../config/config';

const namespace = config.get('podNamespace');
const permissionDelim = ':';

function permissionWrapper(permissionSuffix) {
  const requiredPermission = namespace.concat(permissionDelim, permissionSuffix);

  return (request, response, next) => {
    const grantedPermissions = get(request, 'user.permissions') || [];

    logger.info('Auth: checking permissions');
    logger.debug(`Auth: expected permission suffix: ${permissionSuffix}`);
    logger.debug(`Auth: expected permission: ${requiredPermission}`);
    logger.debug(`Auth: granted user permissions: ${grantedPermissions}`);

    if (grantedPermissions.includes(requiredPermission)) {
      logger.info('Auth: permission check: PASSED');
      next();
    }

    logger.warn('Auth: permission check: FAILED');
    response.status(401);
    return response.send({ message: `User missing expected permission ${requiredPermission}` });
  };
}

export default permissionWrapper;
