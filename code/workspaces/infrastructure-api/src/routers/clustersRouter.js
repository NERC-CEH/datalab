import { body, param, query } from 'express-validator';
import { service } from 'service-chassis';
import express from 'express';
import { permissionTypes } from 'common';
import clustersController from '../controllers/clustersController';
import permissionMiddleware from '../auth/permissionMiddleware';
import { projectKeyValidator, nameValidator } from '../validators/commonValidators';
import { clusterValidator, clusterTypeValidator } from '../validators/clusterValidators';

const { projectPermissions: { PROJECT_KEY_CLUSTERS_CREATE, PROJECT_KEY_CLUSTERS_LIST, PROJECT_KEY_CLUSTERS_DELETE } } = permissionTypes;

const { errorWrapper } = service.middleware;

const clustersRouter = express.Router();

clustersRouter.post(
  '/',
  permissionMiddleware(PROJECT_KEY_CLUSTERS_CREATE),
  clusterValidator(body),
  errorWrapper(clustersController.createCluster),
);

// Use /?projectKey=<projectKey value> to filter by project
clustersRouter.get(
  '/',
  permissionMiddleware(PROJECT_KEY_CLUSTERS_LIST),
  projectKeyValidator(query),
  errorWrapper(clustersController.listByProject),
);

clustersRouter.delete(
  '/:projectKey/:type/:name',
  permissionMiddleware(PROJECT_KEY_CLUSTERS_DELETE),
  projectKeyValidator(param),
  clusterTypeValidator(param),
  nameValidator(param),
  errorWrapper(clustersController.deleteCluster),
);

export default clustersRouter;
