import { body, param } from 'express-validator';
import { service } from 'service-chassis';
import express from 'express';
import { permissionTypes } from 'common';
import notificationsController from './notificationsController';
import permissionMiddleware from '../auth/permissionMiddleware';
import { notificationValidator, notificationIdValidator } from './notificationValidators';

const {
  SYSTEM_INSTANCE_ADMIN,
} = permissionTypes.systemPermissions;

const { errorWrapper } = service.middleware;

const notificationsRouter = express.Router();

notificationsRouter.post(
  '/',
  notificationValidator(body),
  errorWrapper(notificationsController.sendNotification),
);

notificationsRouter.delete(
  '/:id',
  permissionMiddleware(SYSTEM_INSTANCE_ADMIN),
  notificationIdValidator(param),
  errorWrapper(notificationsController.deleteNotification),
);

notificationsRouter.get(
  '/all',
  permissionMiddleware(SYSTEM_INSTANCE_ADMIN),
  errorWrapper(notificationsController.getAllNotifications),
);

export default notificationsRouter;
