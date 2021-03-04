import { service } from 'service-chassis';
import express from 'express';
import { permissionTypes } from 'common';
import clustersController from '../controllers/clustersController';
import { projectPermissionWrapper } from '../auth/permissionMiddleware';
import { paramProjectKeyValidator } from './commonValidators';

const { projectPermissions: { PROJECT_KEY_STACKS_CREATE, PROJECT_KEY_STACKS_LIST } } = permissionTypes;

const { errorWrapper } = service.middleware;

const clustersRouter = express.Router();

clustersRouter.post(
  '/',
  clustersController.clusterValidator(),
  projectPermissionWrapper(PROJECT_KEY_STACKS_CREATE),
  errorWrapper(clustersController.createCluster),
);
clustersRouter.get(
  '/project/:projectKey',
  paramProjectKeyValidator(),
  projectPermissionWrapper(PROJECT_KEY_STACKS_LIST),
  errorWrapper(clustersController.listByProject),
);

export default clustersRouter;
