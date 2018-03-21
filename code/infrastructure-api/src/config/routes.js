import status from '../controllers/status';
import stack from '../controllers/stackController';
import stacks from '../controllers/stacksController';
import volume from '../controllers/volumeController';
import verifyToken from '../auth/authMiddleware';
import permissionWrapper from '../auth/permissionMiddleware';

const STACKS_LIST = 'stacks:list';
const STACKS_OPEN = 'stacks:open';
const STACKS_CREATE = 'stacks:create';
const STACKS_DELETE = 'stacks:delete';
const STORAGE_LIST = 'storage:list';
const STORAGE_CREATE = 'storage:create';
const STORAGE_DELETE = 'storage:delete';

function configureRoutes(app) {
  app.get('/status', status.status);
  app.all('*', verifyToken); // Routes above this line are not auth checked
  app.get('/stacks', permissionWrapper(STACKS_LIST), stacks.listStacks);
  app.get('/stacks/category/:category', permissionWrapper(STACKS_LIST), stacks.withCategoryValidator, stacks.listByCategory);
  app.get('/stacks/mount/:mount', permissionWrapper(STORAGE_DELETE), stacks.withMountValidator, stacks.listByMount);
  app.get('/stack/id/:id', permissionWrapper(STACKS_OPEN), stack.withIdValidator, stack.getOneById);
  app.get('/stack/name/:name', permissionWrapper(STACKS_CREATE), stack.withNameValidator, stack.getOneByName);
  app.delete('/stack', permissionWrapper(STACKS_DELETE), stack.deleteStackValidator, stack.deleteStack);
  app.post('/stack', permissionWrapper(STACKS_CREATE), stack.createStackValidator, stack.createStack);
  app.post('/volume/query', permissionWrapper(STORAGE_LIST), volume.coreVolumeValidator, volume.queryVolume);
  app.get('/volumes', permissionWrapper(STORAGE_LIST), volume.listVolumes);
  app.post('/volume', permissionWrapper(STORAGE_CREATE), volume.createVolumeValidator, volume.createVolume);
  app.delete('/volume', permissionWrapper(STORAGE_DELETE), volume.coreVolumeValidator, volume.deleteVolume);
}

export default { configureRoutes };
