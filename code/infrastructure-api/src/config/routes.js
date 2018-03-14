import status from '../controllers/status';
import stack from '../controllers/stackController';
import volume from '../controllers/volumeController';
import verifyToken from '../auth/authMiddleware';
import permissionWrapper from '../auth/permissionMiddleware';

function configureRoutes(app) {
  app.get('/status', status.status);
  app.all('*', verifyToken); // Routes above this line are not auth checked
  app.get('/stacks', permissionWrapper('stacks:list'), stack.listStacks);
  app.post('/stacks', permissionWrapper('stacks:create'), stack.createStackValidator, stack.createStack);
  app.delete('/stacks', permissionWrapper('stacks:delete'), stack.coreStackValidator, stack.deleteStack);
  app.get('/volumes', permissionWrapper('storage:list'), volume.listVolumes);
  app.post('/volumes', permissionWrapper('storage:create'), volume.createVolumeValidator, volume.createVolume);
  app.delete('/volumes', permissionWrapper('storage:delete'), volume.coreVolumeValidator, volume.deleteVolume);
  app.post('/volumes/query', permissionWrapper('storage:list'), volume.coreVolumeValidator, volume.queryVolume);
}

export default { configureRoutes };
