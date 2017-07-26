import { get } from 'lodash';
import request from '../auth/secureRequest';
import apiBase from './apiBase';

const apiURL = `${apiBase}/api`;

function loadDataStorage() {
  return request.post(apiURL, { query: '{ dataStorage { capacityTotal capacityUsed linkToStorage name storageType } }' })
    .then(res => get(res, 'data.data.dataStorage'));
}

function loadDataStore(dataStoreId) {
  return request.post(apiURL, { query: `{ dataStore(id: ${dataStoreId}) { capacityTotal capacityUsed linkToStorage name storageType } }` })
    .then(res => get(res, 'data.data.dataStore'));
}

export default {
  loadDataStorage,
  loadDataStore,
};
