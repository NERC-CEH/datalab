import auth from '../controllers/authorisation';
import status from '../controllers/status';
import userManagement, { getUserValidator } from '../controllers/userManagement';
import projectController, { addRoleValidator, removeRoleValidator } from '../controllers/projectController';
import { cookieAuthMiddleware, tokenAuthMiddleware } from '../auth/authZeroAuthMiddleware';
import { permissionChecker, projectPermissionChecker } from '../auth/permissionCheckerMiddleware';
import dtMW from '../auth/datalabsAuthMiddleware';

// Error wrapper function to allow controller functions to omit try/catch block
const ew = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

function configureRoutes(app) {
  app.get('/status', status.status);
  app.get('/auth', cookieAuthMiddleware, auth.checkUser);
  app.get('/authorise', tokenAuthMiddleware, auth.generatePermissionToken);
  app.get('/permissions', dtMW, auth.getPermissionsForUser);
  app.get('/jwks', auth.serveJWKS);
  app.get('/users/:userId', dtMW, permissionChecker(['users:read']), getUserValidator, userManagement.getUser);
  app.get('/users', dtMW, permissionChecker(['users:list']), userManagement.getUsers);
  app.get('/projects/:projectKey/users', dtMW, projectPermissionChecker(['permissions:read']), ew(projectController.getUserRoles));
  app.put('/projects/:projectKey/users/:userId/roles', dtMW, projectPermissionChecker(['permissions:create']), addRoleValidator, ew(projectController.addUserRole));
  app.delete('/projects/:projectKey/users/:userId/role', dtMW, projectPermissionChecker(['permissions:delete']), removeRoleValidator, ew(projectController.removeUserRole));
}

export default { configureRoutes };
