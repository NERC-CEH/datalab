import express from 'express';
import { service } from 'service-chassis';
import { permissionTypes } from 'common';
import { permissionWrapper, projectPermissionWrapper } from '../auth/permissionMiddleware';
import volume from '../controllers/volumeController';

const { errorWrapper: ew } = service.middleware;

const {
  elementPermissions: { STORAGE_LIST },
  projectPermissions: { PROJECT_KEY_STORAGE_LIST, PROJECT_KEY_STORAGE_EDIT },
} = permissionTypes;

const volumesRouter = express.Router();

// TODO - routes running permission wrapper won't currently work.
//  Don't know use case for them and UI interaction seems to be working as expected so leaving for now.

volumesRouter.get(
  '/',
  permissionWrapper(STORAGE_LIST),
  ew(volume.listVolumes),
);
volumesRouter.get(
  '/active/:projectKey',
  projectPermissionWrapper(PROJECT_KEY_STORAGE_LIST),
  volume.projectKeyValidator,
  ew(volume.listProjectActiveVolumes),
);
volumesRouter.get(
  '/:projectKey/:id',
  projectPermissionWrapper(PROJECT_KEY_STORAGE_LIST),
  volume.getByIdValidator,
  ew(volume.getById),
);
volumesRouter.put(
  '/:projectKey/:name/addUsers',
  projectPermissionWrapper(PROJECT_KEY_STORAGE_EDIT),
  volume.updateVolumeUserValidator,
  ew(volume.addUsers),
);
volumesRouter.put(
  '/:projectKey/:name/removeUsers',
  projectPermissionWrapper(PROJECT_KEY_STORAGE_EDIT),
  volume.updateVolumeUserValidator,
  ew(volume.removeUsers),
);

export default volumesRouter;
