import auth from '../controllers/authorisation';
import status from '../controllers/status';
import userManagement from '../controllers/userManagement';
import projectController, { addRoleValidator } from '../controllers/projectController';
import { cookieAuthMiddleware, tokenAuthMiddleware } from '../auth/authZeroAuthMiddleware';
import { permissionChecker, projectPermissionChecker } from '../auth/permissionCheckerMiddleware';
import datalabsTokenMiddleware from '../auth/datalabsAuthMiddleware';

// Error wrapper function to allow controller functions to omit try/catch block
const ew = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

function configureRoutes(app) {
  app.get('/status', status.status);
  app.get('/auth', cookieAuthMiddleware, auth.checkUser);
  app.get('/authorise', tokenAuthMiddleware, auth.generatePermissionToken);
  app.get('/permissions', datalabsTokenMiddleware, auth.getPermissionsForUser);
  app.get('/jwks', auth.serveJWKS);
  app.get('/users', datalabsTokenMiddleware, permissionChecker(['users:list']), userManagement.getUsers);
  app.get('/projects/:projectName/users', datalabsTokenMiddleware, projectPermissionChecker(['permissions:read']), ew(projectController.getUserRoles));
  app.put('/projects/:projectName/users/:userId/role', datalabsTokenMiddleware, projectPermissionChecker(['permissions:create']), addRoleValidator, ew(projectController.addUserRole));
}

export default { configureRoutes };
