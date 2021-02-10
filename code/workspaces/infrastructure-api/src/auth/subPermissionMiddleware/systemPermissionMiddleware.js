import { permissionTypes } from 'common';
import {
  permissionGranted, getUserPermissionsFromRequest, containsPermission, grantPermission, addPermissionError, logHelper, permissionsMatchingRegExp, exportMiddleware,
} from './utils';

function systemPermissionMiddleware(acceptedPermissions) {
  const middlewareName = 'systemPermissionMiddleware';

  return (request, response, next) => {
    if (permissionGranted(request)) {
      logHelper.alreadyGranted(middlewareName);
      return next();
    }

    const userPermissions = getUserPermissionsFromRequest(request);
    logHelper.checkingPermission(middlewareName, acceptedPermissions, userPermissions);
    if (containsPermission(acceptedPermissions, userPermissions)) {
      logHelper.permissionCheckPassed(middlewareName);
      grantPermission(request);
    } else {
      logHelper.permissionCheckFailed(middlewareName, 'no acceptable permission found.');
      addPermissionError(
        request,
        `User missing acceptable system permission. Requires one of: ${acceptedPermissions}.`,
      );
    }

    return next();
  };
}

const permissionsHandled = permissions => permissionsMatchingRegExp(permissions, new RegExp(`^${permissionTypes.SYSTEM}`));

export default exportMiddleware(
  permissionsHandled,
  systemPermissionMiddleware,
);
