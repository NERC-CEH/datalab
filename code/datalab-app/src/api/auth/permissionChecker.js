import logger from 'winston';

const permissionDelim = ':';
const projectName = 'project';

function permissionWrapper(permissionSuffix, { permissions }, next) {
  const requiredPermission = projectName.concat(permissionDelim, permissionSuffix);
  const grantedPermissions = permissions || [];

  logger.info('Auth: checking permissions');
  logger.debug(`Auth: expected permission suffix: ${permissionSuffix}`);
  logger.debug(`Auth: expected permission: ${requiredPermission}`);
  logger.debug(`Auth: granted user permissions: ${grantedPermissions}`);

  if (!grantedPermissions.includes(requiredPermission)) {
    logger.warn('Auth: permission check: FAILED');
    return Promise.reject(new Error(`User missing expected permission: ${requiredPermission}`));
  }

  logger.info('Auth: permission check: PASSED');
  return next();
}

export default permissionWrapper;
