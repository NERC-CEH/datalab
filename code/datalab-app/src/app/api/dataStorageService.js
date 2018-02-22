import { get } from 'lodash';
import { gqlMutation, gqlQuery } from './graphqlClient';

function loadDataStorage() {
  const query = `
    DataStorage {
      dataStorage {
         id, name, displayName, description, type, stacksMountingStore { id }
      }
    }`;

  return gqlQuery(query)
    .then(handleErrors('data.dataStorage'));
}

function getCredentials(id) {
  const query = `
    GetCredentials($id: ID!) {
      dataStore(id: $id) {
        url, accessKey
      }
    }`;

  return gqlQuery(query, { id })
    .then(handleErrors('data.dataStore'));
}

function checkDataStoreName(name) {
  const query = `
    CheckDataStoreName($name: String!) {
      checkDataStoreName(name: $name) {
        id
      }
    }`;

  return gqlQuery(query, { name })
    .then(handleErrors('data.checkDataStoreName'));
}

function createDataStore(dataStore) {
  const mutation = `
    CreateDataStore($dataStore:  DataStorageCreationRequest) {
      createDataStore(dataStore: $dataStore) {
        name
      }
    }`;

  return gqlMutation(mutation, { dataStore })
    .then(handleErrors('data.dataStorage'));
}

function deleteDataStore(dataStore) {
  const mutation = `
    DeleteDataStore($dataStore: DataStorageDeletionRequest) {
      deleteDataStore(dataStore: $dataStore) {
        name
      }
    }`;

  return gqlMutation(mutation, { dataStore })
    .then(handleErrors('data.dataStorage'));
}

function handleErrors(pathToData) {
  return (response) => {
    const { errors } = response;
    if (errors) {
      const firstError = errors[0];

      throw new Error(firstError.message || firstError);
    }

    return get(response, pathToData);
  };
}

export default {
  loadDataStorage,
  getCredentials,
  checkDataStoreName,
  createDataStore,
  deleteDataStore,
};
