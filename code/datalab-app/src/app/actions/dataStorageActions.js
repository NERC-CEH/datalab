import dataStorageService from '../api/dataStorageService';
import minioService from '../api/minioService';

export const LOAD_DATASTORAGE_ACTION = 'LOAD_DATASTORAGE';
export const LOAD_DATASTORE_ACTION = 'LOAD_DATASTORE';
export const OPEN_MINIO_DATASTORE_ACTION = 'OPEN_MINIO_DATASTORE';
export const CREATE_DATASTORE_ACTION = 'CREATE_DATASTORE';
export const DELETE_DATASTORE_ACTION = 'DELETE_DATASTORE';

const loadDataStorage = () => ({
  type: LOAD_DATASTORAGE_ACTION,
  payload: dataStorageService.loadDataStorage(),
});

const loadDataStore = dataStoreId => ({
  type: LOAD_DATASTORE_ACTION,
  payload: dataStorageService.loadDataStore(dataStoreId),
});

const openMinioDataStore = (storageUrl, token) => ({
  type: OPEN_MINIO_DATASTORE_ACTION,
  payload: minioService.openStorage(storageUrl, token),
});

const createDataStore = dataStore => ({
  type: CREATE_DATASTORE_ACTION,
  payload: dataStorageService.createDataStore(dataStore),
});

const deleteDataStore = (dataStore) => {
  const { name } = dataStore;
  return {
    type: DELETE_DATASTORE_ACTION,
    payload: dataStorageService.deleteDataStore({ name }),
  };
};

export default {
  loadDataStorage,
  loadDataStore,
  openMinioDataStore,
  createDataStore,
  deleteDataStore,
};
