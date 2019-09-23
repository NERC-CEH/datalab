import { gqlMutation, gqlQuery } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

function loadDataStorage(projectKey) {
  const query = `
    DataStorage($projectKey: String!) {
      dataStorage(projectKey: $projectKey) {
         id, name, displayName, description, type, stacksMountingStore { id }, status, users
      }
    }`;

  return gqlQuery(query, { projectKey })
    .then(errorHandler('data.dataStorage', 'users'));
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
    DeleteDataStore($dataStore: DataStorageUpdateRequest) {
      deleteDataStore(dataStore: $dataStore) {
        name
      }
    }`;

  return gqlMutation(mutation, { dataStore })
    .then(errorHandler('data.dataStorage'));
}

function addUserToDataStore(dataStore) {
  const mutation = `
    AddUserToDataStore($dataStore:  DataStorageUpdateRequest) {
      addUserToDataStore(dataStore: $dataStore) {
        name
      }
    }`;

  return gqlMutation(mutation, { dataStore })
    .then(errorHandler('data.dataStorage'));
}

function removeUserFromDataStore(dataStore) {
  const mutation = `
    RemoveUserFromDataStore($dataStore:  DataStorageUpdateRequest) {
      removeUserFromDataStore(dataStore: $dataStore) {
        name
      }
    }`;

  return gqlMutation(mutation, { dataStore })
    .then(errorHandler('data.dataStorage'));
}

export default {
  loadDataStorage,
  getCredentials,
  createDataStore,
  deleteDataStore,
  addUserToDataStore,
  removeUserFromDataStore,
};
