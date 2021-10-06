import { body, param, query } from 'express-validator';
import { service } from 'service-chassis';
import express from 'express';
import { permissionTypes } from 'common';
import clustersController from '../controllers/clustersController';
import permissionMiddleware from '../auth/permissionMiddleware';
import { projectKeyValidator, nameValidator } from '../validators/commonValidators';
import { clusterValidator, clusterTypeValidator, mountValidator } from '../validators/clusterValidators';

const {
  projectPermissions: {
    PROJECT_KEY_CLUSTERS_CREATE,
    PROJECT_KEY_CLUSTERS_LIST,
    PROJECT_KEY_CLUSTERS_DELETE,
    PROJECT_KEY_STORAGE_LIST,
    PROJECT_KEY_STACKS_SCALE,
  },
} = permissionTypes;

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

clustersRouter.get(
  '/:projectKey/mount/:volumeMount',
  permissionMiddleware(PROJECT_KEY_STORAGE_LIST, PROJECT_KEY_CLUSTERS_LIST),
  projectKeyValidator(param),
  mountValidator(param),
  errorWrapper(clustersController.listByMount),
);

clustersRouter.delete(
  '/:projectKey/:type/:name',
  permissionMiddleware(PROJECT_KEY_CLUSTERS_DELETE),
  projectKeyValidator(param),
  clusterTypeValidator(param),
  nameValidator(param),
  errorWrapper(clustersController.deleteCluster),
);

clustersRouter.put(
  '/:projectKey/scaledown',
  permissionMiddleware(PROJECT_KEY_STACKS_SCALE),
  projectKeyValidator(param),
  nameValidator(body),
  clusterTypeValidator(body),
  errorWrapper(clustersController.scaleDownCluster),
);

clustersRouter.put(
  '/:projectKey/scaleup',
  permissionMiddleware(PROJECT_KEY_STACKS_SCALE),
  projectKeyValidator(param),
  nameValidator(body),
  clusterTypeValidator(body),
  errorWrapper(clustersController.scaleUpCluster),
);

export default clustersRouter;
