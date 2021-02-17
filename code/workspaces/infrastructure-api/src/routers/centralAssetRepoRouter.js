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

centralAssetRepoRouter.get(
  '/metadata',
  permissionMiddleware(SYSTEM_DATA_MANAGER),
  errorWrapper(centralAssetRepo.listAssetMetadata),
);

centralAssetRepoRouter.get(
  '/metadata/:projectKey',
  permissionMiddleware(PROJECT_KEY_STACKS_CREATE, SYSTEM_DATA_MANAGER),
  centralAssetRepo.listByProjectKeyValidator(),
  errorWrapper(centralAssetRepo.assetMetadataAvailableToProject),
);

export default centralAssetRepoRouter;
