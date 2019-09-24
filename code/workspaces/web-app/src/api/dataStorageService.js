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

function getCredentials(projectKey, id) {
  const query = `
    GetCredentials($projectKey: String!, $id: ID!) {
      dataStore(projectKey: $projectKey, id: $id) {
        url, accessKey
      }
    }`;

  return gqlQuery(query, { projectKey, id })
    .then(errorHandler('data.dataStore'));
}

function createDataStore(projectKey, dataStore) {
  const mutation = `
    CreateDataStore($projectKey: String!, $dataStore:  DataStorageCreationRequest) {
      createDataStore(projectKey: $projectKey, dataStore: $dataStore) {
        name
      }
    }`;

  return gqlMutation(mutation, { projectKey, dataStore })
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
