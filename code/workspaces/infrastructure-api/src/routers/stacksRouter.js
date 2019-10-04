import express from 'express';
import { service } from 'service-chassis';
import { permissionTypes } from 'common';
import { permissionWrapper, projectPermissionWrapper } from '../auth/permissionMiddleware';
import stacks from '../controllers/stacksController';
import stack from '../controllers/stackController';
import names from '../controllers/nameController';

const { errorWrapper: ew } = service.middleware;

const {
  elementPermissions: { STACKS_LIST },
  projectPermissions: { PROJECT_KEY_STACKS_LIST, PROJECT_KEY_STORAGE_LIST },
} = permissionTypes;

const stacksRouter = express.Router();

// TODO - routes running permission wrapper won't currently work.
//  Don't know use case for them and UI interaction seems to be working as expected so leaving for now.
stacksRouter.get(
  '/',
  permissionWrapper(STACKS_LIST),
  ew(stacks.listStacks),
);
stacksRouter.get(
  '/:projectKey',
  projectPermissionWrapper(PROJECT_KEY_STACKS_LIST),
  stacks.withProjectValidator,
  ew(stacks.listByProject),
);
stacksRouter.get(
  '/:projectKey/category/:category',
  projectPermissionWrapper(PROJECT_KEY_STACKS_LIST),
  stacks.withCategoryValidator,
  ew(stacks.listByCategory),
);
stacksRouter.get(
  '/:projectKey/mount/:mount',
  projectPermissionWrapper(PROJECT_KEY_STORAGE_LIST),
  stacks.withMountValidator,
  ew(stacks.listByMount),
);
stacksRouter.get(
  '/:projectKey/:name/isUnique',
  projectPermissionWrapper(PROJECT_KEY_STACKS_LIST),
  stack.withNameValidator,
  ew(names.isUnique),
);

export default stacksRouter;
