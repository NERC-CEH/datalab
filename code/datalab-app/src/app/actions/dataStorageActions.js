import dataStorageService from '../api/dataStorageService';

export const LOAD_DATASTORAGE_ACTION = 'LOAD_DATASTORAGE';
export const LOAD_DATASTORE_ACTION = 'LOAD_DATASTORE';

const loadDataStorage = () => ({
  type: LOAD_DATASTORAGE_ACTION,
  payload: dataStorageService.loadDataStorage(),
});
const loadDataStore = dataStoreId => ({
  type: LOAD_DATASTORE_ACTION,
  payload: dataStorageService.loadDataStore(dataStoreId),
});

export default {
  loadDataStorage,
  loadDataStore,
};
