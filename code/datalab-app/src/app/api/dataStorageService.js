import { get } from 'lodash';
import { gqlMutation, gqlQuery } from './graphqlClient';

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

function createDataStore(dataStore) {
  const mutation = `
    CreateDataStore($dataStore:  DataStorageCreationRequest) {
      createDataStore(dataStore: $dataStore) {
        name
      }
    }`;

  return gqlMutation(mutation, { dataStore }).then(handleMutationErrors);
}

function deleteDataStore(dataStore) {
  const mutation = `
    DeleteDataStore($dataStore: DataStorageDeletionRequest) {
      deleteDataStore(dataStore: $dataStore) {
        name
      }
    }`;

  return gqlMutation(mutation, { dataStore }).then(handleMutationErrors);
}

function handleMutationErrors(response) {
  if (response.errors) {
    throw new Error(response.errors[0]);
  }
  return get(response, 'data.dataStorage');
}

export default {
  loadDataStorage,
  loadDataStore,
  createDataStore,
  deleteDataStore,
};
