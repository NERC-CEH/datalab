import { get } from 'lodash';
import { permissionTypes } from 'common';
import {
  permissionGranted, addPermissionError, containsPermission, getUserPermissionsFromRequest,
  grantPermission, exportMiddleware, permissionsMatchingRegExp, logHelper, permissionsArrayToString,
} from './utils';

const { projectKeyPermission, PROJECT_NAMESPACE } = permissionTypes;

function projectPermissionMiddleware(acceptedPermissions) {
  const middlewareName = 'projectPermissionMiddleware';

  return (request, response, next) => {
    if (permissionGranted(request)) {
      logHelper.alreadyGranted(middlewareName);
      return next();
    }

    const projectKey = getProjectKeyFromRequest(request);
    if (!projectKey) {
      logHelper.permissionCheckFailed(middlewareName, 'projectKey not defined in request.');
      addPermissionError(
        request,
        "'projectKey' must be defined in either URL or request body",
      );
      return next();
    }

    const processedPermissions = processProjectPermissions(acceptedPermissions, projectKey);
    const userPermissions = getUserPermissionsFromRequest(request);
    logHelper.checkingPermission(middlewareName, processedPermissions, userPermissions);
    if (containsPermission(processedPermissions, userPermissions)) {
      logHelper.permissionCheckPassed(middlewareName);
      grantPermission(request);
    } else {
      logHelper.permissionCheckFailed(middlewareName, 'no acceptable permission found.');
      addPermissionError(
        request,
        `User missing acceptable project permission. Requires one of: ${permissionsArrayToString(processedPermissions)}.`,
      );
    }

    return next();
  };
}

export const getProjectKeyFromRequest = request => get(request, 'params.projectKey')
  || get(request, 'body.projectKey')
  || get(request, 'query.projectKey');

const processProjectPermissions = (rawProjectPermissions, projectKey) => (
  rawProjectPermissions.map(permission => projectKeyPermission(permission, projectKey))
);

const permissionsHandled = permissions => permissionsMatchingRegExp(permissions, new RegExp(`^${PROJECT_NAMESPACE}`));

export default exportMiddleware(
  permissionsHandled,
  projectPermissionMiddleware,
);
