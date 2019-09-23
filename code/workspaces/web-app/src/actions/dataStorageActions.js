import dataStorageService from '../api/dataStorageService';
import minioService from '../api/minioService';

export const LOAD_DATASTORAGE_ACTION = 'LOAD_DATASTORAGE';
export const GET_DATASTORE_CREDENTIALS_ACTION = 'GET_DATASTORE_CREDENTIALS';
export const OPEN_MINIO_DATASTORE_ACTION = 'OPEN_MINIO_DATASTORE';
export const CREATE_DATASTORE_ACTION = 'CREATE_DATASTORE';
export const DELETE_DATASTORE_ACTION = 'DELETE_DATASTORE';
export const ADD_USER_TO_DATASTORE_ACTION = 'ADD_USER_TO_DATASTORE';
export const REMOVE_USER_FROM_DATASTORE_ACTION = 'REMOVE_USER_FROM_DATASTORE';

const loadDataStorage = projectKey => ({
  type: LOAD_DATASTORAGE_ACTION,
  payload: dataStorageService.loadDataStorage(projectKey),
});

const getCredentials = id => ({
  type: GET_DATASTORE_CREDENTIALS_ACTION,
  payload: dataStorageService.getCredentials(id),
});

const openMinioDataStore = (storageUrl, token) => ({
  type: OPEN_MINIO_DATASTORE_ACTION,
  payload: minioService.openStorage(storageUrl, token),
});

const createDataStore = dataStore => ({
  type: CREATE_DATASTORE_ACTION,
  payload: dataStorageService.createDataStore(dataStore),
});

const deleteDataStore = ({ name }) => ({
  type: DELETE_DATASTORE_ACTION,
  payload: dataStorageService.deleteDataStore({ name }),
});

const addUserToDataStore = ({ name, users }) => ({
  type: ADD_USER_TO_DATASTORE_ACTION,
  payload: dataStorageService.addUserToDataStore({ name, users }),
});

const removeUserFromDataStore = ({ name, users }) => ({
  type: REMOVE_USER_FROM_DATASTORE_ACTION,
  payload: dataStorageService.removeUserFromDataStore({ name, users }),
});

export default {
  loadDataStorage,
  getCredentials,
  openMinioDataStore,
  createDataStore,
  deleteDataStore,
  addUserToDataStore,
  removeUserFromDataStore,
};
