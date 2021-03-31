import { permissionTypes } from 'common';
import systemPermissionMiddleware from './subPermissionMiddleware/systemPermissionMiddleware';
import projectPermissionMiddleware from './subPermissionMiddleware/projectPermissionMiddleware';
import { ensurePermissionGrantedMiddleware, initRequestPermissionInfoStructureMiddleware } from './subPermissionMiddleware/utils';

const { SYSTEM_INSTANCE_ADMIN } = permissionTypes;

function permissionMiddleware(...acceptedPermissions) {
  // Currently instance admin can do everything on system
  acceptedPermissions.push(SYSTEM_INSTANCE_ADMIN);

  // array of objects containing
  // getPermissionsHandled: function that takes list of permissions and filters to
  //    return array of permissions that the middleware will handle
  // getMiddleware: function that takes list of permissions and returns a middleware
  //    function configured to check those permissions
  const permissionMiddlewares = [
    systemPermissionMiddleware,
    projectPermissionMiddleware,
  ];

  return [
    // Must be first - adds information to the incoming request used by the following middleware
    initRequestPermissionInfoStructureMiddleware,
    ...permissionMiddlewares
      // remove middleware that won't be handling any requests based on the permissions they handle
      .filter(({ getPermissionsHandled }) => getPermissionsHandled(acceptedPermissions).length > 0)
      // get middleware configured to check the permissions it can handle
      .map(
        ({ getPermissionsHandled, getMiddleware }) => getMiddleware(getPermissionsHandled(acceptedPermissions)),
      ),
    // Must be last - ensures that one of the middleware functions has granted permission
    ensurePermissionGrantedMiddleware,
  ];
}

export default permissionMiddleware;
