import express from 'express';
import { service } from 'service-chassis';
import { permissionTypes } from 'common';
import projects from '../controllers/projectsController';
import { projectPermissionWrapper, systemAdminPermissionWrapper } from '../auth/permissionMiddleware';

const { errorWrapper: ew } = service.middleware;

const { projectPermissions: { PROJECT_KEY_PROJECTS_EDIT } } = permissionTypes;

const projectsRouter = express.Router();

projectsRouter.get(
  '/',
  ew(projects.listProjects),
);
projectsRouter.post(
  '/',
  systemAdminPermissionWrapper(),
  projects.projectDocumentValidator(),
  ew(projects.createProject),
);
projectsRouter.get(
  '/:projectKey',
  projects.actionWithKeyValidator(),
  ew(projects.getProjectByKey),
);
projectsRouter.put(
  '/:projectKey',
  projectPermissionWrapper(PROJECT_KEY_PROJECTS_EDIT),
  projects.projectDocumentValidator(), projects.urlAndBodyProjectKeyMatchValidator(),
  ew(projects.createOrUpdateProject),
);
projectsRouter.delete(
  '/:projectKey',
  systemAdminPermissionWrapper(),
  projects.actionWithKeyValidator(),
  ew(projects.deleteProjectByKey),
);
projectsRouter.get(
  '/:projectKey/isunique',
  systemAdminPermissionWrapper(),
  projects.actionWithKeyValidator(),
  ew(projects.projectKeyIsUnique),
);

export default projectsRouter;
