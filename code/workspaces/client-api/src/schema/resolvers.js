import { statusTypes, permissionTypes } from 'common';
import { version } from '../version';
import permissionChecker, { instanceAdminWrapper, projectPermissionWrapper } from '../auth/permissionChecker';
import stackService from '../dataaccess/stackService';
import dataStorageRepository from '../dataaccess/dataStorageRepository';
import datalabRepository from '../dataaccess/datalabRepository';
import getUserPermissions from '../dataaccess/userPermissionsService';
import internalNameChecker from '../dataaccess/internalNameChecker';
import userService from '../dataaccess/usersService';
import stackApi from '../infrastructure/stackApi';
import dataStoreApi from '../infrastructure/dataStoreApi';
import minioTokenService from '../dataaccess/minioTokenService';
import stackUrlService from '../dataaccess/stackUrlService';
import projectService from '../dataaccess/projectService';
import config from '../config';

const { usersPermissions: { USERS_LIST } } = permissionTypes;
const { elementPermissions: { STORAGE_CREATE, STORAGE_DELETE, STORAGE_LIST, STORAGE_EDIT, STORAGE_OPEN } } = permissionTypes;
const { elementPermissions: { STACKS_CREATE, STACKS_DELETE, STACKS_LIST, STACKS_OPEN } } = permissionTypes;
const { elementPermissions: { PERMISSIONS_CREATE, PERMISSIONS_DELETE } } = permissionTypes;
const { elementPermissions: { SETTINGS_READ, SETTINGS_EDIT } } = permissionTypes;
const { READY } = statusTypes;

const DATALAB_NAME = config.get('datalabName');
const PROJECT_KEY = 'project';

const resolvers = {
  Query: {
    status: () => () => `GraphQL server is running version: ${version}`,
    dataStorage: (obj, args, { user }) => permissionChecker(STORAGE_LIST, user, () => dataStorageRepository.getAllActive(user)),
    dataStore: (obj, { id }, { user }) => permissionChecker(STORAGE_OPEN, user, () => dataStorageRepository.getById(user, id)),
    stack: (obj, { id }, { user, token }) => permissionChecker(STACKS_OPEN, user, () => stackService.getById({ user, token }, id)),
    stacks: (obj, args, { user, token }) => permissionChecker(STACKS_LIST, user, () => stackService.getAll({ user, token })),
    stacksByCategory: (obj, { category }, { user, token }) => permissionChecker(STACKS_LIST, user, () => stackService.getAllByCategory({ user, token }, category)),
    datalab: (obj, { name }, { user }) => datalabRepository.getByName(user, name),
    datalabs: (obj, args, { user }) => datalabRepository.getAll(user),
    userPermissions: (obj, params, { token }) => getUserPermissions(token),
    checkNameUniqueness: (obj, { name }, { user, token }) => permissionChecker([STACKS_CREATE, STORAGE_CREATE], user, () => internalNameChecker({ user, token }, name)),
    users: (obj, args, { user, token }) => permissionChecker(USERS_LIST, user, () => userService.getAll({ token })),
    projects: (obj, args, { token }) => projectService.listProjects(token),
    project: (obj, { projectKey }, { user, token }) => projectPermissionWrapper(projectKey, SETTINGS_READ, token, user, () => projectService.getProjectByKey(projectKey, token)),
  },

  Mutation: {
    createStack: (obj, { stack }, { user, token }) => permissionChecker(STACKS_CREATE, user, () => stackApi.createStack({ user, token }, DATALAB_NAME, { projectKey: PROJECT_KEY, ...stack })),
    deleteStack: (obj, { stack }, { user, token }) => permissionChecker(STACKS_DELETE, user, () => stackApi.deleteStack({ user, token }, DATALAB_NAME, { projectKey: PROJECT_KEY, ...stack })),
    createDataStore: (obj, { dataStore }, { user, token }) => (
      permissionChecker(STORAGE_CREATE, user, () => dataStoreApi.createDataStore({ user, token }, DATALAB_NAME, { projectKey: PROJECT_KEY, ...dataStore }))
    ),
    deleteDataStore: (obj, { dataStore }, { user, token }) => (
      permissionChecker(STORAGE_DELETE, user, () => dataStoreApi.deleteDataStore({ user, token }, DATALAB_NAME, { projectKey: PROJECT_KEY, ...dataStore }))
    ),
    addUserToDataStore: (obj, { dataStore: { name, users } }, { user }) => permissionChecker(STORAGE_EDIT, user, () => dataStorageRepository.addUsers(user, name, users)),
    removeUserFromDataStore: (obj, { dataStore: { name, users } }, { user }) => permissionChecker(STORAGE_EDIT, user, () => dataStorageRepository.removeUsers(user, name, users)),
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
    users: (obj, args, { user }) => permissionChecker(USERS_LIST, user, () => obj.users),
    accessKey: (obj, args, { user }) => minioTokenService.requestMinioToken('project', obj, user),
    stacksMountingStore: ({ name }, args, { user, token }) => stackService.getAllByVolumeMount({ user, token }, name),
    status: () => READY,
  },

  Stack: {
    redirectUrl: obj => stackUrlService(PROJECT_KEY, obj),
  },

  Project: {
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
