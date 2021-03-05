import { service } from 'service-chassis';
import express from 'express';
import { permissionTypes } from 'common';
import clustersController from '../controllers/clustersController';
import permissionMiddleware from '../auth/permissionMiddleware';

const { projectPermissions: { PROJECT_KEY_STACKS_CREATE } } = permissionTypes;

const { errorWrapper } = service.middleware;

const clustersRouter = express.Router();

clustersRouter.post(
  '/',
  permissionMiddleware(PROJECT_KEY_STACKS_CREATE),
  clustersController.clusterValidator(),
  errorWrapper(clustersController.createCluster),
);

export default clustersRouter;
