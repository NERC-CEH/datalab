import { statusTypes, permissionTypes } from 'common';
import { version } from '../version.json';
import projectPermissionWrapper from '../auth/permissionChecker';
import stackService from '../dataaccess/stackService';
import permissionsService from '../dataaccess/userPermissionsService';
import internalNameChecker from '../dataaccess/internalNameChecker';
import usersService from '../dataaccess/usersService';
import stackApi from '../infrastructure/stackApi';
import minioTokenService from '../dataaccess/minioTokenService';
import stackUrlService from '../dataaccess/stackUrlService';
import projectService from '../dataaccess/projectService';
import storageService from '../infrastructure/storageService';
import logsService from '../dataaccess/logsService';
import rolesService from '../dataaccess/rolesService';
import centralAssetRepoService from '../dataaccess/centralAssetRepoService';
import clustersService from '../dataaccess/clustersService';
import messagesService from '../dataaccess/messagesService';
import w from './wrapper';
import { replaceFields } from '../util/converters';

const { elementPermissions: { STORAGE_EDIT } } = permissionTypes;
const { READY } = statusTypes;

const resolvers = {
  Query: {
    status: () => () => `GraphQL server is running version: ${version}`,
    dataStorage: (obj, args, { token }) => w(storageService.getAllProjectActive(args.projectKey, token)),
    dataStore: (obj, args, { token }) => w(storageService.getById(args.projectKey, args.id, token)),
    stack: (obj, args, { token }) => w(stackService.getById(args.projectKey, args.id, { token })),
    stacks: (obj, args, { token }) => w(stackService.getAll(args.projectKey, { token })),
    stacksByCategory: (obj, { params }, { token }) => w(stackService.getAllByCategory(params.projectKey, params.category, { token })),
    userPermissions: (obj, params, { identity, token }) => w(permissionsService.getUserPermissions(identity, token)),
    allUsersAndRoles: (obj, args, { token }) => w(rolesService.getAllUsersAndRoles(token)),
    checkNameUniqueness: (obj, args, { token }) => w(internalNameChecker(args.projectKey, args.name, token)),
    users: (obj, args, { token }) => w(usersService.getAll({ token })),
    projects: (obj, args, { token }) => w(projectService.listProjects(token)),
    allProjectsAndResources: (obj, args, { token }) => w(projectService.getAllProjectsAndResources(token)),
    project: (obj, args, { token }) => w(projectService.getProjectByKey(args.projectKey, token)),
    checkProjectKeyUniqueness: (obj, { projectKey }, { token }) => w(projectService.isProjectKeyUnique(projectKey, token)),
    logs: (obj, args, { token }) => w(logsService.getLogsByName(args.projectKey, args.name, token)),
    centralAssets: (obj, args, { token }) => w(centralAssetRepoService.listCentralAssets(token)),
    centralAssetsAvailableToProject: (obj, { projectKey }, { token }) => w(centralAssetRepoService.listCentralAssetsAvailableToProject(projectKey, token)),
    clusters: (obj, args, { token }) => w(clustersService.getClusters(args.projectKey, token)),
    messages: (obj, args, { token }) => w(messagesService.getMessages(token)),
    allMessages: (obj, args, { token }) => w(messagesService.getAllMessages(token)),
  },

  Mutation: {
    createStack: (obj, { stack }, { user, token }) => w(stackApi.createStack({ user, token }, stack)),
    updateStack: (obj, { stack }, { user, token }) => w(stackApi.updateStack({ user, token }, stack)),
    deleteStack: (obj, { stack }, { user, token }) => w(stackApi.deleteStack({ user, token }, stack)),
    restartStack: (obj, { stack }, { user, token }) => w(stackApi.restartStack({ user, token }, stack)),
    createDataStore: (obj, args, { token }) => w(storageService.createVolume({ projectKey: args.projectKey, ...args.dataStore }, token)),
    deleteDataStore: (obj, args, { token }) => w(storageService.deleteVolume({ projectKey: args.projectKey, ...args.dataStore }, token)),
    addUserToDataStore: (obj, args, { token }) => w(storageService.addUsers(args.projectKey, args.dataStore.name, args.dataStore.users, token)),
    removeUserFromDataStore: (obj, args, { token }) => w(storageService.removeUsers(args.projectKey, args.dataStore.name, args.dataStore.users, token)),
    updateDataStoreDetails: (obj, args, { token }) => w(storageService.updateDetails(args.projectKey, args.name, args.updatedDetails, token)),
    addProjectPermission: (obj, { permission: { projectKey, userId, role } }, { token }) => w(projectService.addProjectPermission(projectKey, userId, role, token)),
    removeProjectPermission: (obj, { permission: { projectKey, userId } }, { token }) => w(projectService.removeProjectPermission(projectKey, userId, token)),
    createProject: (obj, { project }, { user, token }) => w(projectService.createProject(project, user, token)),
    updateProject: (obj, { project }, { token }) => w(projectService.updateProject(project, token)),
    deleteProject: (obj, { project: { projectKey } }, { token }) => w(projectService.deleteProject(projectKey, token)),
    createCentralAssetMetadata: (obj, { metadata }, { token }) => w(centralAssetRepoService.createAssetMetadata(metadata, token)),
    updateCentralAssetMetadata: (obj, { metadata }, { token }) => w(centralAssetRepoService.updateAssetMetadata(metadata, token)),
    setInstanceAdmin: (obj, { userId, instanceAdmin }, { token }) => w(usersService.setInstanceAdmin(userId, instanceAdmin, token)),
    setDataManager: (obj, { userId, dataManager }, { token }) => w(usersService.setDataManager(userId, dataManager, token)),
    setCatalogueRole: (obj, { userId, catalogueRole }, { token }) => w(usersService.setCatalogueRole(userId, catalogueRole, token)),
    createCluster: (obj, { cluster }, { token }) => w(clustersService.createCluster(cluster, token)),
    deleteCluster: (obj, { cluster }, { token }) => w(clustersService.deleteCluster(cluster, token)),
    createMessage: (obj, { message }, { token }) => w(messagesService.createMessage(message, token)),
    deleteMessage: (obj, { messageId }, { token }) => w(messagesService.deleteMessage(messageId, token)),
  },

  CentralAssetMetadata: {
    owners: (obj, args, { token }) => (obj.ownerUserIds ? obj.ownerUserIds.map(userId => ({ userId, name: usersService.getUserName(userId, token) })) : []),
    projects: (obj, args, { token }) => projectService.getMultipleProjects(obj.projectKeys, token),
  },

  DataStore: {
    id: obj => (obj._id), // eslint-disable-line no-underscore-dangle
    users: async ({ projectKey, users }, args, { user }) => {
      try {
        return await projectPermissionWrapper({ projectKey }, STORAGE_EDIT, user, () => users);
      } catch (error) {
        return [];
      }
    },
    accessKey: (obj, args, { token }) => minioTokenService.requestMinioToken(obj, token),
    stacksMountingStore: ({ name, projectKey }, args, { token }) => (projectKey
      ? replaceFields(stackService.getAllByVolumeMount(projectKey, name, { token }), token) : []),
    clustersMountingStore: ({ name, projectKey }, args, { token }) => (projectKey
      ? clustersService.getClustersByMount(projectKey, name, token) : []),
    status: () => READY,
  },

  Stack: {
    id: obj => (obj._id), // eslint-disable-line no-underscore-dangle
    redirectUrl: (obj, args, { token }) => stackUrlService(obj.projectKey, obj, token),
    category: obj => (obj.category ? obj.category.toUpperCase() : null),
    assets: ({ projectKey, assetIds = [] }, args, { token }) => assetIds.map(id => centralAssetRepoService.getAssetByIdAndProjectKey(id, projectKey, token)),
  },

  Project: {
    id: obj => (obj._id), // eslint-disable-line no-underscore-dangle
    projectUsers: (obj, args, ctx) => usersService.getProjectUsers(obj.key, ctx.token),
    accessible: (obj, args, ctx) => usersService.isMemberOfProject(obj.key, ctx.token),
  },

  ProjectUser: {
    name: (obj, args, ctx) => usersService.getUserName(obj.userId, ctx.token),
  },

  Cluster: {
    id: obj => (obj._id), // eslint-disable-line no-underscore-dangle
  },

  Message: {
    id: obj => obj._id || obj.id, // eslint-disable-line no-underscore-dangle
  },
};

export default resolvers;
