import express from 'express';
import { service } from 'service-chassis';
import { permissionTypes } from 'common';
import permissionMiddleware from '../auth/permissionMiddleware';
import volume from '../controllers/volumeController';

const { errorWrapper: ew } = service.middleware;

const {
  projectPermissions: { PROJECT_KEY_STORAGE_CREATE, PROJECT_KEY_STORAGE_DELETE },
} = permissionTypes;

const volumeRouter = express.Router();

volumeRouter.post(
  '/',
  permissionMiddleware(PROJECT_KEY_STORAGE_CREATE),
  volume.createVolumeValidator,
  ew(volume.createVolume),
);
volumeRouter.delete(
  '/',
  permissionMiddleware(PROJECT_KEY_STORAGE_DELETE),
  volume.deleteVolumeValidator,
  ew(volume.deleteVolume),
);

export default volumeRouter;
