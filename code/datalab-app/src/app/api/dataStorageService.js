import { get } from 'lodash';
import { gqlMutation, gqlQuery } from './graphqlClient';

function loadDataStorage() {
  const query = `
    DataStorage {
      dataStorage {
         id, name, displayName, description, type, stacksMountingStore { id }
      }
    }`;

  return gqlQuery(query).then(res => get(res, 'data.dataStorage'));
}

function getCredentials(id) {
  const query = `
    GetCredentials($id: ID!) {
      dataStore(id: $id) {
        url, accessKey
      }
    }`;

  return gqlQuery(query, { id }).then(res => get(res, 'data.dataStore'));
}

function checkDataStoreName(name) {
  const query = `
    CheckDataStoreName($name: String!) {
      checkDataStoreName(name: $name) {
        id
      }
    }`;

  return gqlQuery(query, { name }).then(res => get(res, 'data.checkDataStoreName'));
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
  getCredentials,
  checkDataStoreName,
  createDataStore,
  deleteDataStore,
};
