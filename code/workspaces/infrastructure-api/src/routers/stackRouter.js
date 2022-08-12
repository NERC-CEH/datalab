import express from 'express';
import { service } from 'service-chassis';
import { permissionTypes } from 'common';
import permissionMiddleware from '../auth/permissionMiddleware';
import stack from '../controllers/stackController';

const { errorWrapper: ew } = service.middleware;

const {
  projectPermissions: {
    PROJECT_KEY_STACKS_OPEN, PROJECT_KEY_STACKS_CREATE,
    PROJECT_KEY_STACKS_DELETE, PROJECT_KEY_STACKS_EDIT,
    PROJECT_KEY_STACKS_SCALE,
  },
} = permissionTypes;

const stackRouter = express.Router();

stackRouter.get(
  '/:projectKey/id/:id',
  permissionMiddleware(PROJECT_KEY_STACKS_OPEN),
  stack.withIdValidator,
  ew(stack.getOneById),
);
stackRouter.get(
  '/:projectKey/name/:name/access',
  permissionMiddleware(PROJECT_KEY_STACKS_OPEN),
  stack.withNameValidator,
  ew(stack.updateAccessTime),
);
stackRouter.get(
  '/:projectKey/name/:name',
  permissionMiddleware(PROJECT_KEY_STACKS_CREATE),
  stack.withNameValidator,
  ew(stack.getOneByName),
);
stackRouter.post(
  '/:projectKey',
  permissionMiddleware(PROJECT_KEY_STACKS_CREATE),
  stack.createStackValidator,
  ew(stack.createStack),
);
stackRouter.put(
  '/:projectKey',
  permissionMiddleware(PROJECT_KEY_STACKS_EDIT),
  stack.updateStackValidator,
  ew(stack.updateStack),
);
stackRouter.put(
  '/:projectKey/restart',
  permissionMiddleware(PROJECT_KEY_STACKS_EDIT),
  stack.restartStackValidator,
  ew(stack.restartStack),
);
stackRouter.put(
  '/:projectKey/scaledown',
  permissionMiddleware(PROJECT_KEY_STACKS_SCALE),
  stack.scaleStackValidator,
  ew(stack.scaleDownStack),
);
stackRouter.put(
  '/:projectKey/scaleup',
  permissionMiddleware(PROJECT_KEY_STACKS_SCALE),
  stack.scaleStackValidator,
  ew(stack.scaleUpStack),
);
stackRouter.delete(
  '/:projectKey',
  permissionMiddleware(PROJECT_KEY_STACKS_DELETE),
  stack.deleteStackValidator,
  ew(stack.deleteStack),
);

export default stackRouter;
