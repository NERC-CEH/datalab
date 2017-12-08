import { DataStoreType, DataStorageCreationType } from '../types/dataStoreTypes';
import config from '../config';
import dataStoreApi from '../infrastructure/dataStoreApi';

const DATALAB_NAME = config.get('datalabName');

export const createDataStore = {
  type: DataStoreType,
  description: 'Create a new data store',
  args: {
    dataStore: { type: DataStorageCreationType },
  },
  resolve: (obj, { dataStore }, { user }) => dataStoreApi.createDataStore(user, DATALAB_NAME, dataStore),
};
