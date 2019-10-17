import { statusTypes, permissionTypes } from 'common';
import config from '../config';
import { version } from '../version';
import permissionChecker, { instanceAdminWrapper, projectPermissionWrapper } from '../auth/permissionChecker';
import stackService from '../dataaccess/stackService';
import datalabRepository from '../dataaccess/datalabRepository';
import getUserPermissions from '../dataaccess/userPermissionsService';
import internalNameChecker from '../dataaccess/internalNameChecker';
import userService from '../dataaccess/usersService';
import stackApi from '../infrastructure/stackApi';
import minioTokenService from '../dataaccess/minioTokenService';
import stackUrlService from '../dataaccess/stackUrlService';
import projectService from '../dataaccess/projectService';
import storageService from '../infrastructure/storageService';

const { usersPermissions: { USERS_LIST } } = permissionTypes;
const { elementPermissions: { STORAGE_CREATE, STORAGE_DELETE, STORAGE_LIST, STORAGE_EDIT, STORAGE_OPEN } } = permissionTypes;
const { elementPermissions: { STACKS_CREATE, STACKS_DELETE, STACKS_LIST, STACKS_OPEN } } = permissionTypes;
const { elementPermissions: { PERMISSIONS_CREATE, PERMISSIONS_DELETE } } = permissionTypes;
const { elementPermissions: { SETTINGS_EDIT } } = permissionTypes;
const { READY } = statusTypes;

const DATALAB_NAME = config.get('datalabName');
const PROJECT_KEY = 'project';

const resolvers = {
  Query: {
    status: () => () => `GraphQL server is running version: ${version}`,
    dataStorage: (obj, args, { user, token }) => projectPermissionWrapper(args, STORAGE_LIST, user, () => storageService.getAllProjectActive(args.projectKey, token)),
    dataStore: (obj, args, { user, token }) => projectPermissionWrapper(args, STORAGE_OPEN, user, () => storageService.getById(args.projectKey, args.id, token)),
    stack: (obj, args, { user, token }) => projectPermissionWrapper(args, STACKS_OPEN, user, () => stackService.getById(args.projectKey, args.id, { user, token })),
    stacks: (obj, args, { user, token }) => projectPermissionWrapper(args, STACKS_LIST, user, () => stackService.getAll(args.projectKey, { user, token })),
    stacksByCategory: (obj, { params }, { user, token }) => (
      projectPermissionWrapper(params, STACKS_LIST, user, () => stackService.getAllByCategory(params.projectKey, params.category, { user, token }))
    ),
    datalab: (obj, { name }, { user }) => datalabRepository.getByName(user, name),
    datalabs: (obj, args, { user }) => datalabRepository.getAll(user),
    userPermissions: (obj, params, { token }) => getUserPermissions(token),
    checkNameUniqueness: (obj, { name }, { user, token }) => permissionChecker([STACKS_CREATE, STORAGE_CREATE], user, () => internalNameChecker(PROJECT_KEY, name, token)),
    users: (obj, args, { user, token }) => permissionChecker(USERS_LIST, user, () => userService.getAll({ token })),
    projects: (obj, args, { token }) => projectService.listProjects(token),
    project: (obj, args, { token }) => projectService.getProjectByKey(args.projectKey, token),
    checkProjectKeyUniqueness: (obj, { projectKey }, { user, token }) => instanceAdminWrapper(user, () => projectService.isProjectKeyUnique(projectKey, token)),
  },

  Mutation: {
    createStack: (obj, { stack }, { user, token }) => projectPermissionWrapper(stack, STACKS_CREATE, user, () => stackApi.createStack({ user, token }, DATALAB_NAME, stack)),
    deleteStack: (obj, { stack }, { user, token }) => projectPermissionWrapper(stack, STACKS_DELETE, user, () => stackApi.deleteStack({ user, token }, DATALAB_NAME, stack)),
    createDataStore: (obj, args, { user, token }) => (
      projectPermissionWrapper(args, STORAGE_CREATE, user, () => storageService.createVolume({ projectKey: args.projectKey, ...args.dataStore }, token))
    ),
    deleteDataStore: (obj, args, { user, token }) => (
      projectPermissionWrapper(args, STORAGE_DELETE, user, () => storageService.deleteVolume({ projectKey: args.projectKey, ...args.dataStore }, token))
    ),
    addUserToDataStore: (obj, args, { user, token }) => (
      projectPermissionWrapper(args, STORAGE_EDIT, user, () => storageService.addUsers(args.projectKey, args.dataStore.name, args.dataStore.users, token))
    ),
    removeUserFromDataStore: (obj, args, { user, token }) => (
      projectPermissionWrapper(args, STORAGE_EDIT, user, () => storageService.removeUsers(args.projectKey, args.dataStore.name, args.dataStore.users, token))
    ),
    addProjectPermission: (obj, { permission: { projectKey, userId, role } }, { user, token }) => (
      permissionChecker(PERMISSIONS_CREATE, user, () => projectService.addProjectPermission(projectKey, userId, role, token))
    ),
    removeProjectPermission: (obj, { permission: { projectKey, userId } }, { user, token }) => (
      permissionChecker(PERMISSIONS_DELETE, user, () => projectService.removeProjectPermission(projectKey, userId, token))
    ),
    createProject: (obj, { project }, { user, token }) => instanceAdminWrapper(user, () => projectService.createProject(project, token)),
    updateProject: (obj, { project }, { user, token }) => permissionChecker(SETTINGS_EDIT, user, () => projectService.updateProject(project, token)),
    deleteProject: (obj, { project: { projectKey } }, { user, token }) => instanceAdminWrapper(user, () => projectService.deleteProject(projectKey, token)),
  },

  DataStore: {
    id: obj => (obj._id), // eslint-disable-line no-underscore-dangle
    users: (obj, args, { user }) => permissionChecker(USERS_LIST, user, () => obj.users),
    accessKey: obj => minioTokenService.requestMinioToken(obj),
    stacksMountingStore: ({ name }, args, { user, token }) => stackService.getAllByVolumeMount(PROJECT_KEY, name, { user, token }),
    status: () => READY,
  },

  Stack: {
    redirectUrl: obj => stackUrlService(obj.projectKey, obj),
  },

  Project: {
    id: obj => (obj._id), // eslint-disable-line no-underscore-dangle
    projectUsers: (obj, args, ctx) => userService.getProjectUsers(obj.key, ctx.token),
    accessible: (obj, args, ctx) => userService.isMemberOfProject(obj.key, ctx.token),
  },

  ProjectUser: {
    name: (obj, args, ctx) => userService.getUserName(obj.userId, ctx.token),
  },

  // This mapping is required to map the string to an id in the database.
  // Ideally it would be removed but this would break existing database entries
  StorageType: {
    nfs: 1,
  },
};

export default resolvers;
