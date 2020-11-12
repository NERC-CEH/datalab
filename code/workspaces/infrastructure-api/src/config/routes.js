import status from '../controllers/status';
import verifyToken from '../auth/authMiddleware';
import projectsRouter from '../routers/projectsRouter';
import stackRouter from '../routers/stackRouter';
import stacksRouter from '../routers/stacksRouter';
import volumeRouter from '../routers/volumeRouter';
import volumesRouter from '../routers/volumesRouter';
import logsRouter from '../routers/logsRouter';
import userResourcesRouter from '../routers/userResourcesRouter';

function configureRoutes(app) {
  app.get('/status', status.status);
  app.all('*', verifyToken); // Routes above this line are not auth checked
  app.use('/projects', projectsRouter);
  app.use('/stack', stackRouter);
  app.use('/stacks', stacksRouter);
  app.use('/volume', volumeRouter);
  app.use('/volumes', volumesRouter);
  app.use('/logs', logsRouter);
  app.use('/userresources', userResourcesRouter);
}

export default { configureRoutes };
