import express from 'express';
import { service } from 'service-chassis';
import { check } from 'express-validator';
import { systemAdminPermissionWrapper } from '../auth/permissionMiddleware';
import userResourcesController from '../controllers/userResourcesController';

import logger from '../config/logger';

const { errorWrapper: ew } = service.middleware;

const userResourcesRouter = express.Router();

const userIdValidator = () => service.middleware.validator([
  check('userId').exists().withMessage('userId must be specified in URL.'),
], logger);

userResourcesRouter.get(
  '/:userId',
  systemAdminPermissionWrapper(),
  userIdValidator(),
  ew(userResourcesController.listUserResources),
);

export default userResourcesRouter;
