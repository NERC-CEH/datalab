import express from 'express';
import { service } from 'service-chassis';
import { permissionTypes } from 'common';
import { projectPermissionWrapper } from '../auth/permissionMiddleware';
import logs from '../controllers/logsController';

const { errorWrapper: ew } = service.middleware;

const {
  projectPermissions: { PROJECT_KEY_STACKS_CREATE },
} = permissionTypes;

const logsRouter = express.Router();

logsRouter.get(
  '/:projectKey/:name',
  projectPermissionWrapper(PROJECT_KEY_STACKS_CREATE),
  logs.getByNameValidator,
  ew(logs.getByName),
);

export default logsRouter;
