import status from '../controllers/status';
import stack from '../controllers/stackController';
import stacks from '../controllers/stacksController';
import volume from '../controllers/volumeController';
import verifyToken from '../auth/authMiddleware';
import permissionWrapper from '../auth/permissionMiddleware';

function configureRoutes(app) {
  app.get('/status', status.status);
  app.all('*', verifyToken); // Routes above this line are not auth checked
  app.get('/stacks', permissionWrapper('stacks:list'), stacks.coreStacksValidator, stacks.listStacks);
  app.get('/stacks/category/:category', permissionWrapper('stacks:list'), stacks.withCategoryValidator, stacks.listByCategory);
  app.get('/stack/id/:id', permissionWrapper('stacks:open'), stack.withIdValidator, stack.getOneById);
  app.get('/stack/name/:name', permissionWrapper('stacks:create'), stack.withNameValidator, stack.getOneByName);
  app.delete('/stack', permissionWrapper('stacks:delete'), stack.deleteStackValidator, stack.deleteStack);
  app.post('/stack', permissionWrapper('stacks:create'), stack.createStackValidator, stack.createStack);
  app.post('/volume', permissionWrapper('storage:create'), volume.createVolumeValidator, volume.createVolume);
  app.delete('/volume', permissionWrapper('storage:delete'), volume.coreVolumeValidator, volume.deleteVolume);
  app.post('/volume/query', permissionWrapper('storage:list'), volume.coreVolumeValidator, volume.queryVolume);
  app.get('/volumes', permissionWrapper('storage:list'), volume.listVolumes);
}

export default { configureRoutes };
