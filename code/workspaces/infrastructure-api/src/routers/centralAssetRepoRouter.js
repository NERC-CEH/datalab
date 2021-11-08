import { body, param, query } from 'express-validator';
import { service } from 'service-chassis';
import express from 'express';
import { permissionTypes } from 'common';
import centralAssetRepo from '../controllers/centralAssetRepoController';
import permissionMiddleware from '../auth/permissionMiddleware';
import { createValidator, updateValidator, assetIdValidator } from '../validators/centralAssetRepoValidators';
import { optionalProjectKeyValidator } from '../validators/commonValidators';

const { projectPermissions: { PROJECT_KEY_STACKS_CREATE }, SYSTEM_DATA_MANAGER } = permissionTypes;

const { errorWrapper } = service.middleware;

const centralAssetRepoRouter = express.Router();

centralAssetRepoRouter.post(
  '/metadata',
  permissionMiddleware(SYSTEM_DATA_MANAGER),
  createValidator(body),
  errorWrapper(centralAssetRepo.createAssetMetadata),
);

centralAssetRepoRouter.put(
  '/metadata/:assetId',
  permissionMiddleware(SYSTEM_DATA_MANAGER),
  assetIdValidator(param),
  updateValidator(body),
  errorWrapper(centralAssetRepo.updateAssetMetadata),
);

// Use /metadata?projectKey=<projectKey value> to filter by metadata available to project
// When projectKey query added, user's project permissions are checked, otherwise requires system permission to access
centralAssetRepoRouter.get(
  '/metadata',
  permissionMiddleware(PROJECT_KEY_STACKS_CREATE, SYSTEM_DATA_MANAGER),
  optionalProjectKeyValidator(query),
  errorWrapper(centralAssetRepo.listAssetMetadata),
);

// No permission middleware on this as we handle specific cases on metadata retrieval at the DB level.
centralAssetRepoRouter.get(
  '/allowedMetadata',
  errorWrapper(centralAssetRepo.getAllMetadata),
);

// Use /metadata/:assetId?projectKey=<projectKey value> to filter by metadata available to project
// When projectKey query added, user's project permissions are checked, otherwise requires system permission to access
centralAssetRepoRouter.get(
  '/metadata/:assetId',
  permissionMiddleware(PROJECT_KEY_STACKS_CREATE, SYSTEM_DATA_MANAGER),
  assetIdValidator(param),
  optionalProjectKeyValidator(query),
  errorWrapper(centralAssetRepo.getAssetById),
);

export default centralAssetRepoRouter;
