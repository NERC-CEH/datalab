import express from 'express';
import { service } from 'service-chassis';
import { systemAdminPermissionWrapper } from '../auth/permissionMiddleware';
import resourcesController from '../controllers/resourcesController';

const { errorWrapper } = service.middleware;

const resourcesRouter = express.Router();

resourcesRouter.get(
  '/',
  systemAdminPermissionWrapper(),
  errorWrapper(resourcesController.getAllProjectsAndResources),
);

export default resourcesRouter;
