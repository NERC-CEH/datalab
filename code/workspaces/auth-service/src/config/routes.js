import { service } from 'service-chassis';
import { permissionTypes } from 'common';
import auth from '../controllers/authorisation';
import status from '../controllers/status';
import userManagement, { getUserValidator } from '../controllers/userManagement';
import projectController, { addRoleValidator, removeRoleValidator } from '../controllers/projectController';
import { cookieAuthMiddleware, tokenAuthMiddleware } from '../auth/authZeroAuthMiddleware';
import { permissionChecker, projectPermissionChecker } from '../auth/permissionCheckerMiddleware';
import dtMW from '../auth/datalabsAuthMiddleware';

const { errorWrapper: ew } = service.middleware;

const { SYSTEM_INSTANCE_ADMIN, projectPermissions: {
  PROJECT_KEY_PERMISSIONS_CREATE, PROJECT_KEY_PERMISSIONS_DELETE, PROJECT_KEY_PROJECTS_READ,
} } = permissionTypes;

function configureRoutes(app) {
  app.get('/status', status.status);
  app.get('/auth', cookieAuthMiddleware, auth.checkUser);
  app.get('/authorise', tokenAuthMiddleware, auth.generatePermissionToken);
  app.get('/permissions', dtMW, auth.getPermissionsForUser);
  app.get('/roles/:userId', dtMW, getUserValidator, permissionChecker(SYSTEM_INSTANCE_ADMIN), auth.getRolesForOtherUser);
  app.get('/jwks', auth.serveJWKS);
  app.get('/users/:userId', dtMW, getUserValidator, userManagement.getUser);
  app.get('/users', dtMW, userManagement.getUsers);
  app.get('/projects/:projectKey/is-member', dtMW, ew(projectController.isMember));
  app.get('/projects/:projectKey/users', dtMW, projectPermissionChecker(PROJECT_KEY_PROJECTS_READ), ew(projectController.getUserRoles));
  app.put('/projects/:projectKey/users/:userId/roles', dtMW, projectPermissionChecker(PROJECT_KEY_PERMISSIONS_CREATE), addRoleValidator, ew(projectController.addUserRole));
  app.delete('/projects/:projectKey/users/:userId/role', dtMW, projectPermissionChecker(PROJECT_KEY_PERMISSIONS_DELETE), removeRoleValidator, ew(projectController.removeUserRole));
}

export default { configureRoutes };
