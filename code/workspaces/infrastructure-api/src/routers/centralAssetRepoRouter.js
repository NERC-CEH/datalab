import { service } from 'service-chassis';
import express from 'express';
import { permissionTypes } from 'common';
import centralAssetRepo from '../controllers/centralAssetRepoController';
import { projectPermissionWrapper, systemDataManagerPermissionWrapper } from '../auth/permissionMiddleware';

const { projectPermissions: { PROJECT_KEY_STACKS_CREATE } } = permissionTypes;

const { errorWrapper } = service.middleware;

const centralAssetRepoRouter = express.Router();

centralAssetRepoRouter.post(
  '/metadata',
  systemDataManagerPermissionWrapper(),
  centralAssetRepo.metadataValidator(),
  errorWrapper(centralAssetRepo.createAssetMetadata),
);

centralAssetRepoRouter.get(
  '/metadata',
  projectPermissionWrapper(PROJECT_KEY_STACKS_CREATE),
  centralAssetRepo.listByProjectKeyValidator(),
  errorWrapper(centralAssetRepo.assetMetadataAvailableToProject),
);

export default centralAssetRepoRouter;
