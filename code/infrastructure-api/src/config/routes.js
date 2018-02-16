import status from '../controllers/status';
import stack from '../controllers/stackController';
import volume from '../controllers/volumeController';
import verifyToken from '../auth/authMiddleware';
import permissionWrapper from '../auth/permissionMiddleware';

function configureRoutes(app) {
  app.get('/status', status.status);
  app.all('*', verifyToken); // Routes above this line are not auth checked
  app.post('/stacks', stack.createStackValidator, stack.createStack);
  app.delete('/stacks', stack.coreStackValidator, stack.deleteStack);
  app.get('/volumes', permissionWrapper('storage:list'), volume.listVolumes); // Route not used by GQL
  app.post('/volumes', permissionWrapper('storage:create'), volume.createVolumeValidator, volume.createVolume);
  app.delete('/volumes', permissionWrapper('storage:delete'), volume.coreVolumeValidator, volume.deleteVolume);
  app.post('/volumes/query', volume.coreVolumeValidator, volume.queryVolume); // Route not used by GQL
}

export default { configureRoutes };
