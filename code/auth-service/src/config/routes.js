import auth from '../controllers/authorisation';
import status from '../controllers/status';
import { cookieAuthMiddleware, tokenAuthMiddleware } from '../auth/authMiddleware';

function configureRoutes(app) {
  app.get('/auth', cookieAuthMiddleware, auth.checkUser);
  app.get('/authorise', tokenAuthMiddleware, auth.generatePermissionToken);
  app.get('/jwks', auth.serveJWKS);
  app.get('/status', status.status);
}

export default { configureRoutes };
