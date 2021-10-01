import { body, param } from 'express-validator';
import { service } from 'service-chassis';
import express from 'express';
import { permissionTypes } from 'common';
import messagesController from '../controllers/messagesController';
import permissionMiddleware from '../auth/permissionMiddleware';
import { messageValidator, messageIdValidator } from '../validators/messageValidators';

const {
  SYSTEM_INSTANCE_ADMIN,
} = permissionTypes.systemPermissions;

const { errorWrapper } = service.middleware;

const messagesRouter = express.Router();

messagesRouter.post(
  '/',
  permissionMiddleware(SYSTEM_INSTANCE_ADMIN),
  messageValidator(body),
  errorWrapper(messagesController.createMessage),
);

messagesRouter.delete(
  '/:id',
  permissionMiddleware(SYSTEM_INSTANCE_ADMIN),
  messageIdValidator(param),
  errorWrapper(messagesController.deleteMessage),
);

messagesRouter.get(
  '/',
  errorWrapper(messagesController.getActiveMessages),
);

messagesRouter.get(
  '/all',
  errorWrapper(messagesController.getAllMessages),
);

export default messagesRouter;
