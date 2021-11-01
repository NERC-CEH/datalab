import status from '../controllers/status';
import verifyToken from '../auth/authMiddleware';
import projectsRouter from '../routers/projectsRouter';
import stackRouter from '../routers/stackRouter';
import stacksRouter from '../routers/stacksRouter';
import volumeRouter from '../routers/volumeRouter';
import volumesRouter from '../routers/volumesRouter';
import logsRouter from '../routers/logsRouter';
import resourcesRouter from '../routers/resourcesRouter';
import secretRouter from '../routers/secretRouter';
import centralAssetRepoRouter from '../routers/centralAssetRepoRouter';
import clustersRouter from '../routers/clustersRouter';
import messagesRouter from '../routers/messagesRouter';
import notificationsRouter from '../notifications/notificationsRouter';

function configureRoutes(app) {
  app.get('/status', status.status);
  app.all('*', verifyToken); // Routes above this line are not auth checked
  app.use('/centralAssetRepo', centralAssetRepoRouter);
  app.use('/clusters', clustersRouter);
  app.use('/logs', logsRouter);
  app.use('/messages', messagesRouter);
  app.use('/notifications', notificationsRouter);
  app.use('/projects', projectsRouter);
  app.use('/resources', resourcesRouter);
  app.use('/secrets', secretRouter);
  app.use('/stack', stackRouter);
  app.use('/stacks', stacksRouter);
  app.use('/volume', volumeRouter);
  app.use('/volumes', volumesRouter);
}

export default { configureRoutes };
