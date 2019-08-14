import { permissionTypes } from 'common';
import { DataStoreType, DataStorageCreationType, DataStorageUpdateType } from '../types/dataStoreTypes';
import config from '../config';
import dataStorageRepository from '../dataaccess/dataStorageRepository';
import dataStoreApi from '../infrastructure/dataStoreApi';
import permissionChecker from '../auth/permissionChecker';

const { elementPermissions: { STORAGE_CREATE, STORAGE_DELETE, STORAGE_EDIT } } = permissionTypes;

const DATALAB_NAME = config.get('datalabName');

export const createDataStore = {
  type: DataStoreType,
  description: 'Create a new data store',
  args: {
    dataStore: { type: DataStorageCreationType },
  },
  resolve: (obj, { dataStore }, { user, token }) => permissionChecker(STORAGE_CREATE, user, () => dataStoreApi.createDataStore({ user, token }, DATALAB_NAME, dataStore)),
};

export const deleteDataStore = {
  type: DataStoreType,
  description: 'Delete a data store',
  args: {
    dataStore: { type: DataStorageUpdateType },
  },
  resolve: (obj, { dataStore }, { user, token }) => permissionChecker(STORAGE_DELETE, user, () => dataStoreApi.deleteDataStore({ user, token }, DATALAB_NAME, dataStore)),
};

export const addUserToDataStore = {
  type: DataStoreType,
  description: 'Grant user access to data store',
  args: {
    dataStore: { type: DataStorageUpdateType },
  },
  resolve: (obj, { dataStore: { name, users } }, { user }) => permissionChecker(STORAGE_EDIT, user, () => dataStorageRepository.addUsers(user, name, users)),
};

export const removeUserFromDataStore = {
  type: DataStoreType,
  description: 'Remove user access to data store',
  args: {
    dataStore: { type: DataStorageUpdateType },
  },
  resolve: (obj, { dataStore: { name, users } }, { user }) => permissionChecker(STORAGE_EDIT, user, () => dataStorageRepository.removeUsers(user, name, users)),
};
