import auth from '../controllers/authorisation';
import status from '../controllers/status';
import userManagement from '../controllers/userManagement';
import { cookieAuthMiddleware, tokenAuthMiddleware } from '../auth/authZeroAuthMiddleware';
import datalabsTokenMiddleware from '../auth/datalabsAuthMiddleware';

function configureRoutes(app) {
  app.get('/auth', cookieAuthMiddleware, auth.checkUser);
  app.get('/permissions', datalabsTokenMiddleware, auth.getPermissionsForUser);
  app.get('/authorise', tokenAuthMiddleware, auth.generatePermissionToken);
  app.get('/users', userManagement.getUsers);
  app.get('/jwks', auth.serveJWKS);
  app.get('/status', status.status);
}

export default { configureRoutes };
