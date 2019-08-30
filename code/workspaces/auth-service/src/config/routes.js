import auth from '../controllers/authorisation';
import status from '../controllers/status';
import userManagement from '../controllers/userManagement';
import projectController from '../controllers/projectController';
import { cookieAuthMiddleware, tokenAuthMiddleware } from '../auth/authZeroAuthMiddleware';
import { permissionChecker, projectPermissionChecker } from '../auth/permissionCheckerMiddleware';
import datalabsTokenMiddleware from '../auth/datalabsAuthMiddleware';

function configureRoutes(app) {
  app.get('/auth', cookieAuthMiddleware, auth.checkUser);
  app.get('/authorise', tokenAuthMiddleware, auth.generatePermissionToken);
  app.get('/permissions', datalabsTokenMiddleware, auth.getPermissionsForUser);
  app.get('/users', datalabsTokenMiddleware, permissionChecker(['users:list']), userManagement.getUsers);
  app.get('/projects/:projectName/users', datalabsTokenMiddleware, projectPermissionChecker((['permissions:read'])), projectController.getUserRoles);
  app.get('/jwks', auth.serveJWKS);
  app.get('/status', status.status);
}

export default { configureRoutes };
