import { DataStoreType, DataStorageCreationType, DataStorageUpdateType } from '../types/dataStoreTypes';
import config from '../config';
import dataStoreApi from '../infrastructure/dataStoreApi';
import dataStorageRepository from '../dataaccess/dataStorageRepository';
import permissionChecker from '../auth/permissionChecker';
import { elementPermissions, usersPermissions } from '../../shared/permissionTypes';

const { STORAGE_CREATE, STORAGE_DELETE } = elementPermissions;
const { USERS_LIST } = usersPermissions;

const DATALAB_NAME = config.get('datalabName');

export const createDataStore = {
  type: DataStoreType,
  description: 'Create a new data store',
  args: {
    dataStore: { type: DataStorageCreationType },
  },
  resolve: (obj, { dataStore }, { user, token }) =>
    permissionChecker(STORAGE_CREATE, user, () => dataStoreApi.createDataStore({ user, token }, DATALAB_NAME, dataStore)),
};

export const deleteDataStore = {
  type: DataStoreType,
  description: 'Delete a data store',
  args: {
    dataStore: { type: DataStorageUpdateType },
  },
  resolve: (obj, { dataStore }, { user, token }) =>
    permissionChecker(STORAGE_DELETE, user, () => dataStoreApi.deleteDataStore({ user, token }, DATALAB_NAME, dataStore)),
};

export const addUserToDataStore = {
  type: DataStoreType,
  description: 'Grant user access to data store',
  args: {
    dataStore: { type: DataStorageUpdateType },
  },
  resolve: (obj, { dataStore: { name, users } }, { user }) =>
    permissionChecker(USERS_LIST, user, () => dataStorageRepository.addUsers(user, name, users)),
};

export const removeUserFromDataStore = {
  type: DataStoreType,
  description: 'Remove user access to data store',
  args: {
    dataStore: { type: DataStorageUpdateType },
  },
  resolve: (obj, { dataStore: { name, users } }, { user }) =>
    permissionChecker(USERS_LIST, user, () => dataStorageRepository.removeUsers(user, name, users)),
};
