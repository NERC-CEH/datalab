import express from 'express';
import { service } from 'service-chassis';
import { permissionTypes } from 'common';
import permissionMiddleware from '../auth/permissionMiddleware';

import volume from '../controllers/volumeController';

const { errorWrapper: ew } = service.middleware;

const {
  projectPermissions: { PROJECT_KEY_STORAGE_LIST, PROJECT_KEY_STORAGE_EDIT },
} = permissionTypes;

const volumesRouter = express.Router();

volumesRouter.get(
  '/active/:projectKey',
  permissionMiddleware(PROJECT_KEY_STORAGE_LIST),
  volume.projectKeyValidator,
  ew(volume.listProjectActiveVolumes),
);
volumesRouter.get(
  '/:projectKey/:id',
  permissionMiddleware(PROJECT_KEY_STORAGE_LIST),
  volume.getByIdValidator,
  ew(volume.getById),
);
volumesRouter.put(
  '/:projectKey/:name/addUsers',
  permissionMiddleware(PROJECT_KEY_STORAGE_EDIT),
  volume.updateVolumeUserValidator,
  ew(volume.addUsers),
);
volumesRouter.put(
  '/:projectKey/:name/removeUsers',
  permissionMiddleware(PROJECT_KEY_STORAGE_EDIT),
  volume.updateVolumeUserValidator,
  ew(volume.removeUsers),
);
volumesRouter.patch(
  '/:projectKey/:name',
  permissionMiddleware(PROJECT_KEY_STORAGE_EDIT),
  volume.updateVolumeValidator,
  ew(volume.updateVolume),
);

export default volumesRouter;
