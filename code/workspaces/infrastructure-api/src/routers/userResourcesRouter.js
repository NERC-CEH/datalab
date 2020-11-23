import express from 'express';
import { service } from 'service-chassis';
import { systemAdminPermissionWrapper } from '../auth/permissionMiddleware';
import userResourcesController from '../controllers/userResourcesController';

const { errorWrapper } = service.middleware;

const userResourcesRouter = express.Router();

userResourcesRouter.get(
  '/:userId',
  systemAdminPermissionWrapper(),
  userResourcesController.userIdValidator(),
  errorWrapper(userResourcesController.listUserResources),
);

export default userResourcesRouter;
