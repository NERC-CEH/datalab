import status from '../controllers/status';
import stack from '../controllers/stackController';
import volume from '../controllers/volumeController';
import verifyToken from '../auth/authMiddleware';

function configureRoutes(app) {
  app.get('/status', status.status);
  app.all('*', verifyToken); // Routes above this line are not auth checked
  app.post('/stacks', stack.createStackValidator, stack.createStack);
  app.delete('/stacks', stack.coreStackValidator, stack.deleteStack);
  app.get('/volumes', volume.listVolumes);
  app.post('/volumes', volume.createVolumeValidator, volume.createVolume);
  app.delete('/volumes', volume.coreVolumeValidator, volume.deleteVolume);
  app.post('/volumes/query', volume.coreVolumeValidator, volume.queryVolume);
}

export default { configureRoutes };
