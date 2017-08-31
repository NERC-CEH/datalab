import status from '../controllers/status';

function configureRoutes(app) {
  app.get('/status', status.status);
}

export default { configureRoutes };
