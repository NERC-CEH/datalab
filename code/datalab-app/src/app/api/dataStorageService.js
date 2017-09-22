import { get } from 'lodash';
import { gqlQuery } from './graphqlClient';

function loadDataStorage() {
  const query = `
      DataStorage {
        dataStorage {
          capacityTotal capacityUsed linkToStorage name storageType accessKey
        }
      }`;

  return gqlQuery(query).then(res => get(res, 'data.dataStorage'));
}

function loadDataStore(dataStoreId) {
  const query = `
      GetDataStore($dataStoreId: ID!) {
        dataStore(id: $dataStoreId) {
          capacityTotal capacityUsed linkToStorage name storageType
        }
      }`;

  return gqlQuery(query, { dataStoreId }).then(res => get(res, 'data.dataStorage'));
}

export default {
  loadDataStorage,
  loadDataStore,
};
