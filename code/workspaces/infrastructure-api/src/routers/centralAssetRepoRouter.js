import { service } from 'service-chassis';
import express from 'express';
import centralAssetRepo from '../controllers/centralAssetRepoController';
import { systemDataManagerPermissionWrapper } from '../auth/permissionMiddleware';

const { errorWrapper } = service.middleware;

const centralAssetRepoRouter = express.Router();

centralAssetRepoRouter.post(
  '/metadata',
  systemDataManagerPermissionWrapper(),
  centralAssetRepo.getMetadataValidator(),
  errorWrapper(centralAssetRepo.createAssetMetadata),
);

export default centralAssetRepoRouter;
