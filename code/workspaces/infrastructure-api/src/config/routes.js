import { service } from 'service-chassis';
import { permissionTypes } from 'common';
import status from '../controllers/status';
import projects from '../controllers/projectsController';
import stack from '../controllers/stackController';
import stacks from '../controllers/stacksController';
import volume from '../controllers/volumeController';
import names from '../controllers/nameController';
import verifyToken from '../auth/authMiddleware';
import { permissionWrapper, projectPermissionWrapper, systemAdminPermissionWrapper } from '../auth/permissionMiddleware';

const {
  elementPermissions: { STORAGE_LIST, STACKS_LIST },
  projectPermissions: {
    PROJECT_KEY_STACKS_LIST, PROJECT_KEY_STACKS_OPEN, PROJECT_KEY_STACKS_CREATE, PROJECT_KEY_STACKS_DELETE,
    PROJECT_KEY_STORAGE_LIST, PROJECT_KEY_STORAGE_EDIT, PROJECT_KEY_STORAGE_CREATE, PROJECT_KEY_STORAGE_DELETE,
    PROJECT_KEY_PROJECTS_READ, PROJECT_KEY_PROJECTS_EDIT,
  },
} = permissionTypes;

const { errorWrapper: ew } = service.middleware;

function configureRoutes(app) {
  // TODO - routes running permission wrapper won't currently work.
  //  Don't know use case for them and UI interaction seems to be working as expected so leaving for now.
  app.get('/status', status.status);
  app.all('*', verifyToken); // Routes above this line are not auth checked
  app.get('/projects', ew(projects.listProjects));
  app.post('/projects', systemAdminPermissionWrapper(), projects.projectDocumentValidator(), ew(projects.createProject));
  app.get('/projects/:projectKey', projectPermissionWrapper(PROJECT_KEY_PROJECTS_READ), projects.actionWithKeyValidator(), ew(projects.getProjectByKey));
  app.put(
    '/projects/:projectKey',
    projectPermissionWrapper(PROJECT_KEY_PROJECTS_EDIT),
    projects.projectDocumentValidator(), projects.urlAndBodyProjectKeyMatchValidator(),
    ew(projects.createOrUpdateProject),
  );
  app.delete('/projects/:projectKey', systemAdminPermissionWrapper(), projects.actionWithKeyValidator(), ew(projects.deleteProjectByKey));
  app.get('/projects/:projectKey/isunique', systemAdminPermissionWrapper(), projects.actionWithKeyValidator(), ew(projects.projectKeyIsUnique));
  app.get('/stacks', permissionWrapper(STACKS_LIST), stacks.listStacks);
  app.get('/stacks/:projectKey', projectPermissionWrapper(PROJECT_KEY_STACKS_LIST), stacks.withProjectValidator, stacks.listByProject);
  app.get('/stacks/:projectKey/category/:category', projectPermissionWrapper(PROJECT_KEY_STACKS_LIST), stacks.withCategoryValidator, stacks.listByCategory);
  app.get('/stacks/:projectKey/mount/:mount', projectPermissionWrapper(PROJECT_KEY_STORAGE_LIST), stacks.withMountValidator, stacks.listByMount);
  app.get('/stacks/:projectKey/:name/isUnique', projectPermissionWrapper(PROJECT_KEY_STACKS_LIST), stack.withNameValidator, names.isUnique);
  app.get('/stack/:projectKey/id/:id', projectPermissionWrapper(PROJECT_KEY_STACKS_OPEN), stack.withIdValidator, stack.getOneById);
  app.get('/stack/:projectKey/name/:name', projectPermissionWrapper(PROJECT_KEY_STACKS_CREATE), stack.withNameValidator, stack.getOneByName);
  app.post('/stack/:projectKey', projectPermissionWrapper(PROJECT_KEY_STACKS_CREATE), stack.createStackValidator, stack.createStack);
  app.delete('/stack/:projectKey', projectPermissionWrapper(PROJECT_KEY_STACKS_DELETE), stack.deleteStackValidator, stack.deleteStack);
  app.get('/volumes', permissionWrapper(STORAGE_LIST), ew(volume.listVolumes));
  app.get('/volumes/active/:projectKey', projectPermissionWrapper(PROJECT_KEY_STORAGE_LIST), volume.projectKeyValidator, ew(volume.listProjectActiveVolumes));
  app.get('/volumes/:projectKey/:id', projectPermissionWrapper(PROJECT_KEY_STORAGE_LIST), volume.getByIdValidator, ew(volume.getById));
  app.put('/volumes/:projectKey/:name/addUsers', projectPermissionWrapper(PROJECT_KEY_STORAGE_EDIT), volume.updateVolumeUserValidator, ew(volume.addUsers));
  app.put('/volumes/:projectKey/:name/removeUsers', projectPermissionWrapper(PROJECT_KEY_STORAGE_EDIT), volume.updateVolumeUserValidator, ew(volume.removeUsers));
  app.post('/volume', projectPermissionWrapper(PROJECT_KEY_STORAGE_CREATE), volume.createVolumeValidator, ew(volume.createVolume));
  app.delete('/volume', projectPermissionWrapper(PROJECT_KEY_STORAGE_DELETE), volume.deleteVolumeValidator, ew(volume.deleteVolume));
}

export default { configureRoutes };
