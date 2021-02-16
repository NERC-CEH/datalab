import { statusTypes, permissionTypes } from 'common';
import config from '../config';
import { version } from '../version';
import { instanceAdminWrapper, projectPermissionWrapper } from '../auth/permissionChecker';
import stackService from '../dataaccess/stackService';
import datalabRepository from '../dataaccess/datalabRepository';
import permissionsService from '../dataaccess/userPermissionsService';
import internalNameChecker from '../dataaccess/internalNameChecker';
import userService from '../dataaccess/usersService';
import stackApi from '../infrastructure/stackApi';
import minioTokenService from '../dataaccess/minioTokenService';
import stackUrlService from '../dataaccess/stackUrlService';
import projectService from '../dataaccess/projectService';
import storageService from '../infrastructure/storageService';
import logsService from '../dataaccess/logsService';
import rolesService from '../dataaccess/rolesService';
import centralAssetRepoService from '../dataaccess/centralAssetRepoService';

const { elementPermissions: { STORAGE_CREATE, STORAGE_DELETE, STORAGE_LIST, STORAGE_EDIT, STORAGE_OPEN } } = permissionTypes;
const { elementPermissions: { STACKS_CREATE, STACKS_EDIT, STACKS_DELETE, STACKS_LIST, STACKS_OPEN } } = permissionTypes;
const { elementPermissions: { PERMISSIONS_CREATE, PERMISSIONS_DELETE } } = permissionTypes;
const { elementPermissions: { SETTINGS_EDIT } } = permissionTypes;
const { READY } = statusTypes;

const DATALAB_NAME = config.get('datalabName');

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
    userPermissions: (obj, params, { identity, token }) => permissionsService.getUserPermissions(identity, token),
    allUsersAndRoles: (obj, args, { token }) => rolesService.getAllUsersAndRoles(token),
    checkNameUniqueness: (obj, args, { user, token }) => projectPermissionWrapper(args, [STACKS_CREATE, STORAGE_CREATE], user, () => internalNameChecker(args.projectKey, args.name, token)),
    users: (obj, args, { token }) => userService.getAll({ token }),
    projects: (obj, args, { token }) => projectService.listProjects(token),
    allProjectsAndResources: (obj, args, { token }) => projectService.getAllProjectsAndResources(token),
    project: (obj, args, { token }) => projectService.getProjectByKey(args.projectKey, token),
    checkProjectKeyUniqueness: (obj, { projectKey }, { user, token }) => instanceAdminWrapper(user, () => projectService.isProjectKeyUnique(projectKey, token)),
    logs: (obj, args, { user, token }) => projectPermissionWrapper(args, STACKS_CREATE, user, () => logsService.getLogsByName(args.projectKey, args.name, token)),
    centralAssets: (obj, args, { token }) => centralAssetRepoService.listCentralAssets(token),
    centralAssetsAvailableToProject: (obj, { projectKey }, { token }) => centralAssetRepoService.listCentralAssetsAvailableToProject(projectKey, token),
  },

  Mutation: {
    createStack: (obj, { stack }, { user, token }) => projectPermissionWrapper(stack, STACKS_CREATE, user, () => stackApi.createStack({ user, token }, DATALAB_NAME, stack)),
    updateStack: (obj, { stack }, { user, token }) => projectPermissionWrapper(stack, STACKS_EDIT, user, () => stackApi.updateStack({ user, token }, DATALAB_NAME, stack)),
    deleteStack: (obj, { stack }, { user, token }) => projectPermissionWrapper(stack, STACKS_DELETE, user, () => stackApi.deleteStack({ user, token }, DATALAB_NAME, stack)),
    restartStack: (obj, { stack }, { user, token }) => projectPermissionWrapper(stack, STACKS_EDIT, user, () => stackApi.restartStack({ user, token }, DATALAB_NAME, stack)),
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
    updateDataStoreDetails: (obj, args, { user, token }) => (
      projectPermissionWrapper(args, STORAGE_EDIT, user, () => storageService.updateDetails(args.projectKey, args.name, args.updatedDetails, token))
    ),
    addProjectPermission: (obj, { permission: { projectKey, userId, role } }, { user, token }) => (
      projectPermissionWrapper({ projectKey }, PERMISSIONS_CREATE, user, () => projectService.addProjectPermission(projectKey, userId, role, token))
    ),
    removeProjectPermission: (obj, { permission: { projectKey, userId } }, { user, token }) => (
      projectPermissionWrapper({ projectKey }, PERMISSIONS_DELETE, user, () => projectService.removeProjectPermission(projectKey, userId, token))
    ),
    createProject: (obj, { project }, { user, token }) => instanceAdminWrapper(user, () => projectService.createProject(project, user, token)),
    updateProject: (obj, { project }, { user, token }) => projectPermissionWrapper({ projectKey: project.projectKey }, SETTINGS_EDIT, user, () => projectService.updateProject(project, token)),
    deleteProject: (obj, { project: { projectKey } }, { user, token }) => instanceAdminWrapper(user, () => projectService.deleteProject(projectKey, token)),
    createCentralAssetMetadata: (obj, { metadata }, { token }) => centralAssetRepoService.createAssetMetadata(metadata, token),
    setInstanceAdmin: (obj, { userId, instanceAdmin }, { user, token }) => instanceAdminWrapper(user, () => userService.setInstanceAdmin(userId, instanceAdmin, token)),
    setDataManager: (obj, { userId, dataManager }, { user, token }) => instanceAdminWrapper(user, () => userService.setDataManager(userId, dataManager, token)),
    setCatalogueRole: (obj, { userId, catalogueRole }, { user, token }) => instanceAdminWrapper(user, () => userService.setCatalogueRole(userId, catalogueRole, token)),
  },

  DataStore: {
    id: obj => (obj._id), // eslint-disable-line no-underscore-dangle
    users: (obj, args, { user }) => (obj.projectKey
      ? projectPermissionWrapper({ projectKey: obj.projectKey }, STORAGE_EDIT, user, () => obj.users, 'DataStore.users') : []),
    accessKey: (obj, args, { token }) => minioTokenService.requestMinioToken(obj, token),
    stacksMountingStore: ({ name, projectKey }, args, { user, token }) => (projectKey
      ? stackService.getAllByVolumeMount(projectKey, name, { user, token }) : []),
    status: () => READY,
  },

  Stack: {
    id: obj => (obj._id), // eslint-disable-line no-underscore-dangle
    redirectUrl: (obj, args, { token }) => stackUrlService(obj.projectKey, obj, token),
    category: obj => (obj.category ? obj.category.toUpperCase() : null),
  },

  Project: {
    id: obj => (obj._id), // eslint-disable-line no-underscore-dangle
    projectUsers: (obj, args, ctx) => userService.getProjectUsers(obj.key, ctx.token),
    accessible: (obj, args, ctx) => userService.isMemberOfProject(obj.key, ctx.token),
  },

  ProjectUser: {
    name: (obj, args, ctx) => userService.getUserName(obj.userId, ctx.token),
  },
};

export default resolvers;
