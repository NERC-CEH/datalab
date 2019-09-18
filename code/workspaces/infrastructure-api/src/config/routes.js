import { service } from 'common';
import status from '../controllers/status';
import projects from '../controllers/projectsController';
import stack from '../controllers/stackController';
import stacks from '../controllers/stacksController';
import volume from '../controllers/volumeController';
import verifyToken from '../auth/authMiddleware';
import permissionWrapper from '../auth/permissionMiddleware';

const PROJECTS_READ = 'projects:read';
const PROJECTS_EDIT = 'projects:edit';
const PROJECTS_CREATE = 'projects:create';
const PROJECTS_DELETE = 'projects:delete';
const STACKS_LIST = 'stacks:list';
const STACKS_OPEN = 'stacks:open';
const STACKS_CREATE = 'stacks:create';
const STACKS_DELETE = 'stacks:delete';
const STORAGE_LIST = 'storage:list';
const STORAGE_CREATE = 'storage:create';
const STORAGE_DELETE = 'storage:delete';
const STORAGE_EDIT = 'storage:edit';

const { errorWrapper: ew } = service.middleware;

function configureRoutes(app) {
  app.get('/status', status.status);
  app.all('*', verifyToken); // Routes above this line are not auth checked
  app.get('/projects', ew(projects.listProjects));
  app.post('/projects', permissionWrapper(PROJECTS_CREATE), projects.projectDocumentValidator(), ew(projects.createProject));
  app.get('/projects/:key', permissionWrapper(PROJECTS_READ), projects.actionWithKeyValidator(), ew(projects.getProjectByKey));
  app.put('/projects/:key', permissionWrapper(PROJECTS_EDIT), projects.actionWithKeyValidator(), projects.projectDocumentValidator(), ew(projects.createOrUpdateProject));
  app.delete('/projects/:key', permissionWrapper(PROJECTS_DELETE), projects.actionWithKeyValidator(), ew(projects.deleteProjectByKey));
  app.get('/stacks', permissionWrapper(STACKS_LIST), stacks.listStacks);
  app.get('/stacks/category/:category', permissionWrapper(STACKS_LIST), stacks.withCategoryValidator, stacks.listByCategory);
  app.get('/stacks/mount/:mount', permissionWrapper(STORAGE_LIST), stacks.withMountValidator, stacks.listByMount);
  app.get('/stack/id/:id', permissionWrapper(STACKS_OPEN), stack.withIdValidator, stack.getOneById);
  app.get('/stack/name/:name', permissionWrapper(STACKS_CREATE), stack.withNameValidator, stack.getOneByName);
  app.delete('/stack', permissionWrapper(STACKS_DELETE), stack.deleteStackValidator, stack.deleteStack);
  app.post('/stack', permissionWrapper(STACKS_CREATE), stack.createStackValidator, stack.createStack);
  app.post('/volume/query', permissionWrapper(STORAGE_LIST), volume.coreVolumeValidator, volume.queryVolume);
  app.get('/volumes', permissionWrapper(STORAGE_LIST), ew(volume.listVolumes));
  app.get('/volumes/active', permissionWrapper(STORAGE_LIST), ew(volume.listActiveVolumes));
  app.get('/volumes/:id', permissionWrapper(STORAGE_LIST), volume.getByIdValidator, ew(volume.getById));
  app.put('/volumes/:name/addUsers', permissionWrapper(STORAGE_EDIT), volume.updateVolumeUserValidator, ew(volume.addUsers));
  app.put('/volumes/:name/removeUsers', permissionWrapper(STORAGE_EDIT), volume.updateVolumeUserValidator, ew(volume.removeUsers));
  app.post('/volume', permissionWrapper(STORAGE_CREATE), volume.createVolumeValidator, ew(volume.createVolume));
  app.delete('/volume', permissionWrapper(STORAGE_DELETE), volume.coreVolumeValidator, ew(volume.deleteVolume));
}

export default { configureRoutes };
