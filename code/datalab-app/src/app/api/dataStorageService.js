import { gqlMutation, gqlQuery } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

function loadDataStorage() {
  const query = `
    DataStorage {
      dataStorage {
         id, name, displayName, description, type, stacksMountingStore { id }
      }
    }`;

  return gqlQuery(query)
    .then(errorHandler('data.dataStorage'));
}

function getCredentials(id) {
  const query = `
    GetCredentials($id: ID!) {
      dataStore(id: $id) {
        url, accessKey
      }
    }`;

  return gqlQuery(query, { id })
    .then(errorHandler('data.dataStore'));
}

function checkDataStoreName(name) {
  const query = `
    CheckDataStoreName($name: String!) {
      checkNameUniqueness(name: $name)
    }`;

  return gqlQuery(query, { name })
    .then(errorHandler('data.checkNameUniqueness'));
}

function createDataStore(dataStore) {
  const mutation = `
    CreateDataStore($dataStore:  DataStorageCreationRequest) {
      createDataStore(dataStore: $dataStore) {
        name
      }
    }`;

  return gqlMutation(mutation, { dataStore })
    .then(errorHandler('data.dataStorage'));
}

function deleteDataStore(dataStore) {
  const mutation = `
    DeleteDataStore($dataStore: DataStorageDeletionRequest) {
      deleteDataStore(dataStore: $dataStore) {
        name
      }
    }`;

  return gqlMutation(mutation, { dataStore })
    .then(errorHandler('data.dataStorage'));
}

export default {
  loadDataStorage,
  getCredentials,
  checkDataStoreName,
  createDataStore,
  deleteDataStore,
};
