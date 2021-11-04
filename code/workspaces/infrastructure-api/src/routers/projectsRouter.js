import express from 'express';
import { service } from 'service-chassis';
import { permissionTypes } from 'common';
import projects from '../controllers/projectsController';
import permissionMiddleware from '../auth/permissionMiddleware';

const { errorWrapper: ew } = service.middleware;

const { projectPermissions: { PROJECT_KEY_SETTINGS_EDIT } } = permissionTypes;

const projectsRouter = express.Router();

projectsRouter.get(
  '/',
  ew(projects.listProjects),
);
projectsRouter.post(
  '/',
  permissionMiddleware(),
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
  permissionMiddleware(PROJECT_KEY_SETTINGS_EDIT),
  projects.projectDocumentValidator(), projects.urlAndBodyProjectKeyMatchValidator(),
  ew(projects.createOrUpdateProject),
);
projectsRouter.delete(
  '/:projectKey',
  permissionMiddleware(),
  projects.actionWithKeyValidator(),
  ew(projects.deleteProjectByKey),
);
projectsRouter.get(
  '/:projectKey/isunique',
  projects.actionWithKeyValidator(),
  ew(projects.projectKeyIsUnique),
);

export default projectsRouter;
