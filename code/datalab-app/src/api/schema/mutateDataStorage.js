import { DataStoreType, DataStorageCreationType, DataStorageDeletionType } from '../types/dataStoreTypes';
import config from '../config';
import dataStoreApi from '../infrastructure/dataStoreApi';

const DATALAB_NAME = config.get('datalabName');

export const createDataStore = {
  type: DataStoreType,
  description: 'Create a new data store',
  args: {
    dataStore: { type: DataStorageCreationType },
  },
  resolve: (obj, { dataStore }, { user, token }) => dataStoreApi.createDataStore({ user, token }, DATALAB_NAME, dataStore),
};

export const deleteDataStore = {
  type: DataStoreType,
  description: 'Delete a data store',
  args: {
    dataStore: { type: DataStorageDeletionType },
  },
  resolve: (obj, { dataStore }, { user, token }) => dataStoreApi.deleteDataStore({ user, token }, DATALAB_NAME, dataStore),
};
