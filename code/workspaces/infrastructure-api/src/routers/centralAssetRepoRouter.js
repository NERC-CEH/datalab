import { service } from 'service-chassis';
import express from 'express';
import { permissionTypes } from 'common';
import centralAssetRepo from '../controllers/centralAssetRepoController';
import permissionMiddleware from '../auth/permissionMiddleware';

const { projectPermissions: { PROJECT_KEY_STACKS_CREATE }, SYSTEM_DATA_MANAGER } = permissionTypes;

const { errorWrapper } = service.middleware;

const centralAssetRepoRouter = express.Router();

centralAssetRepoRouter.post(
  '/metadata',
  permissionMiddleware(SYSTEM_DATA_MANAGER),
  centralAssetRepo.metadataValidator(),
  errorWrapper(centralAssetRepo.createAssetMetadata),
);

// Use /metadata?projectKey=<projectKey value> to filter by metadata available to project
// When projectKey query added, user's project permissions are checked, otherwise requires system permission to access
centralAssetRepoRouter.get(
  '/metadata',
  permissionMiddleware(PROJECT_KEY_STACKS_CREATE, SYSTEM_DATA_MANAGER),
  centralAssetRepo.optionalProjectKeyQueryValidator(),
  errorWrapper(centralAssetRepo.listAssetMetadata),
);

// Use /metadata/:assetId?projectKey=<projectKey value> to filter by metadata available to project
// When projectKey query added, user's project permissions are checked, otherwise requires system permission to access
centralAssetRepoRouter.get(
  '/metadata/:assetId',
  permissionMiddleware(PROJECT_KEY_STACKS_CREATE, SYSTEM_DATA_MANAGER),
  centralAssetRepo.assetIdValidator(),
  centralAssetRepo.optionalProjectKeyQueryValidator(),
  errorWrapper(centralAssetRepo.getAssetById),
);

export default centralAssetRepoRouter;
