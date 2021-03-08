import { service } from 'service-chassis';
import express from 'express';
import { permissionTypes } from 'common';
import clustersController from '../controllers/clustersController';
import permissionMiddleware from '../auth/permissionMiddleware';
import { paramProjectKeyValidator } from './commonValidators';

const { projectPermissions: { PROJECT_KEY_CLUSTERS_CREATE, PROJECT_KEY_CLUSTERS_LIST } } = permissionTypes;

const { errorWrapper } = service.middleware;

const clustersRouter = express.Router();

clustersRouter.post(
  '/',
  permissionMiddleware(PROJECT_KEY_CLUSTERS_CREATE),
  clustersController.clusterValidator(),
  errorWrapper(clustersController.createCluster),
);
clustersRouter.get(
  '/project/:projectKey',
  paramProjectKeyValidator(),
  permissionMiddleware(PROJECT_KEY_CLUSTERS_LIST),
  errorWrapper(clustersController.listByProject),
);

export default clustersRouter;
