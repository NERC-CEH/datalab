import status from '../controllers/status';
import stack from '../controllers/stackController';
import volume from '../controllers/volumeController';

function configureRoutes(app) {
  app.get('/status', status.status);
  app.post('/stacks', stack.createStackValidator, stack.createStack);
  app.delete('/stacks', stack.coreStackValidator, stack.deleteStack);
  app.get('/volumes', volume.listVolumes);
  app.post('/volumes', volume.createVolumeValidator, volume.createVolume);
  app.delete('/volumes', volume.coreVolumeValidator, volume.deleteVolume);
}

export default { configureRoutes };
