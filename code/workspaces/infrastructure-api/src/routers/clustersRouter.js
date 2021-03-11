import { service } from 'service-chassis';
import express from 'express';
import { permissionTypes } from 'common';
import clustersController from '../controllers/clustersController';
import permissionMiddleware from '../auth/permissionMiddleware';
import { queryProjectKeyValidator } from './commonValidators';

const { projectPermissions: { PROJECT_KEY_CLUSTERS_CREATE, PROJECT_KEY_CLUSTERS_LIST } } = permissionTypes;

const { errorWrapper } = service.middleware;

const clustersRouter = express.Router();

clustersRouter.post(
  '/',
  permissionMiddleware(PROJECT_KEY_CLUSTERS_CREATE),
  clustersController.clusterValidator(),
  errorWrapper(clustersController.createCluster),
);

// Use /?projectKey=<projectKey value> to filter by project
clustersRouter.get(
  '/',
  permissionMiddleware(PROJECT_KEY_CLUSTERS_LIST),
  queryProjectKeyValidator(),
  errorWrapper(clustersController.listByProject),
);

export default clustersRouter;
