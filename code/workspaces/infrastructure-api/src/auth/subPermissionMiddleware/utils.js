import { get } from 'lodash';
import logger from '../../config/logger';

export const REQUEST_PERMISSION_INFO_KEY = 'datalabs';

export const initRequestPermissionInfoStructureMiddleware = (request, response, next) => {
  request[REQUEST_PERMISSION_INFO_KEY] = {
    granted: false,
    errors: [],
  };
  return next();
};

export const ensurePermissionGrantedMiddleware = (request, response, next) => {
  if (permissionGranted(request)) {
    logger.debug('Auth: permission check PASSED');
    return next();
  }

  const granted = permissionGranted(request);
  const errors = permissionErrors(request);
  logger.warn(`Auth: permission check FAILED with errors: [${errors.join(', ')}]`);
  return response.status(401).send({ permissionGranted: granted, errors });
};

export const getRequestPermissionInfo = request => request[REQUEST_PERMISSION_INFO_KEY];

export const permissionGranted = request => getRequestPermissionInfo(request).granted;

export const grantPermission = (request) => {
  getRequestPermissionInfo(request).granted = true;
};

export const permissionErrors = request => getRequestPermissionInfo(request).errors;

export const addPermissionError = (request, message) => {
  getRequestPermissionInfo(request).errors.push(message);
};

export const containsPermission = (acceptedPermissions, grantedPermissions) => (
  acceptedPermissions.some(permission => grantedPermissions.includes(permission))
);

export const getUserPermissionsFromRequest = request => get(request, 'user.permissions') || [];

export const permissionsMatchingRegExp = (permissions, regexp) => permissions.filter(permission => permission.match(regexp));

export const exportMiddleware = (getPermissionsHandled, getMiddleware) => ({ getPermissionsHandled, getMiddleware });

export const logHelper = {
  alreadyGranted: (middlewareName) => {
    logger.debug(`Auth: ${middlewareName}: permission already granted. Skipping check.`);
  },
  checkingPermission: (middlewareName, acceptedPermissions, userPermissions) => {
    logger.debug(`Auth: ${middlewareName}: checking permissions - accepted permissions: [${acceptedPermissions.join(', ')}] user permissions: [${userPermissions.join(', ')}]`);
  },
  permissionCheckPassed: (middlewareName) => {
    logger.debug(`Auth: ${middlewareName}: permission check PASSED`);
  },
  permissionCheckFailed: (middlewareName, optionalMessage) => {
    let message = `Auth: ${middlewareName}: permission check FAILED`;
    if (optionalMessage) message += ` - ${optionalMessage}`;
    logger.debug(message);
  },
};

