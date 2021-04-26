import express from 'express';
import { service } from 'service-chassis';
import { permissionTypes } from 'common';
import permissionMiddleware from '../auth/permissionMiddleware';
import stacks from '../controllers/stacksController';
import stack from '../controllers/stackController';
import names from '../controllers/nameController';

const { errorWrapper: ew } = service.middleware;

const {
  elementPermissions: { STACKS_LIST },
  projectPermissions: { PROJECT_KEY_STACKS_LIST, PROJECT_KEY_STORAGE_LIST },
} = permissionTypes;

const stacksRouter = express.Router();

stacksRouter.get(
  '/',
  permissionMiddleware(STACKS_LIST),
  ew(stacks.listStacks),
);
stacksRouter.get(
  '/:projectKey',
  permissionMiddleware(PROJECT_KEY_STACKS_LIST),
  stacks.withProjectValidator,
  ew(stacks.listByProject),
);
stacksRouter.get(
  '/:projectKey/category/:category',
  permissionMiddleware(PROJECT_KEY_STACKS_LIST),
  stacks.withCategoryValidator,
  ew(stacks.listByCategory),
);
stacksRouter.get(
  '/:projectKey/mount/:mount',
  permissionMiddleware(PROJECT_KEY_STORAGE_LIST),
  stacks.withMountValidator,
  ew(stacks.listByMount),
);
stacksRouter.get(
  '/:projectKey/:name/isUnique',
  permissionMiddleware(PROJECT_KEY_STORAGE_LIST, PROJECT_KEY_STACKS_LIST),
  stack.withNameValidator,
  ew(names.isUnique),
);

export default stacksRouter;
