import auth from '../controllers/authorisation';
import status from '../controllers/status';
import authMiddleware from '../auth/authMiddleware';

function configureRoutes(app) {
  app.get('/auth', authMiddleware, auth.checkUser);
  app.get('/status', status.status);
}

export default { configureRoutes };
