import dataStorageService from '../api/dataStorageService';
import minioService from '../api/minioService';

export const LOAD_DATASTORAGE_ACTION = 'LOAD_DATASTORAGE';
export const LOAD_DATASTORE_ACTION = 'LOAD_DATASTORE';
export const OPEN_MINIO_DATASTORE_ACTION = 'OPEN_MINIO_DATASTORE';

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

export default {
  loadDataStorage,
  loadDataStore,
  openMinioDataStore,
};
