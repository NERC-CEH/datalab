import express from 'express';
import { service } from 'service-chassis';
import { permissionTypes } from 'common';
import { projectPermissionWrapper } from '../auth/permissionMiddleware';
import stack from '../controllers/stackController';

const { errorWrapper: ew } = service.middleware;

const {
  projectPermissions: {
    PROJECT_KEY_STACKS_OPEN, PROJECT_KEY_STACKS_CREATE,
    PROJECT_KEY_STACKS_DELETE, PROJECT_KEY_STACKS_EDIT,
  },
} = permissionTypes;

const stackRouter = express.Router();

stackRouter.get(
  '/:projectKey/id/:id',
  projectPermissionWrapper(PROJECT_KEY_STACKS_OPEN),
  stack.withIdValidator,
  ew(stack.getOneById),
);
stackRouter.get(
  '/:projectKey/name/:name',
  projectPermissionWrapper(PROJECT_KEY_STACKS_CREATE),
  stack.withNameValidator,
  ew(stack.getOneByName),
);
stackRouter.post(
  '/:projectKey',
  projectPermissionWrapper(PROJECT_KEY_STACKS_CREATE),
  stack.createStackValidator,
  ew(stack.createStack),
);
stackRouter.put(
  '/:projectKey',
  projectPermissionWrapper(PROJECT_KEY_STACKS_EDIT),
  stack.updateStackValidator,
  ew(stack.updateStack),
);
stackRouter.put(
  '/:projectKey/restart',
  projectPermissionWrapper(PROJECT_KEY_STACKS_EDIT),
  stack.restartStackValidator,
  ew(stack.restartStack),
);
stackRouter.delete(
  '/:projectKey',
  projectPermissionWrapper(PROJECT_KEY_STACKS_DELETE),
  stack.deleteStackValidator,
  ew(stack.deleteStack),
);

export default stackRouter;
