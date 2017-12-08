import logger from 'winston';
import axiosErrorHandler from '../util/errorHandlers';
import datalabRepository from '../dataaccess/datalabRepository';
import dataStorageRepository from '../dataaccess/dataStorageRepository';

const CREATE_ERROR_MESSAGE = 'Unable to create Data Store';
const DELETE_ERROR_MESSAGE = 'Unable to delete Data Store';

function createDataStore(user, datalabName, dataStore) {
  logger.info(`Requesting data store creation for data store called '${dataStore.name}'`);
  return datalabRepository.getByName(user, datalabName)
    .then(storeAndCreateDataStore(user, dataStore))
    .catch(axiosErrorHandler(CREATE_ERROR_MESSAGE));
}

function deleteDataStore(user, datalabName, dataStore) {
  logger.info(`Requesting data store deletion for data store called '${dataStore.name}'`);
  return datalabRepository.getByName(user, datalabName)
    .then(removeAndDeleteDataStore(user, dataStore))
    .then(() => dataStore)
    .catch(axiosErrorHandler(DELETE_ERROR_MESSAGE));
}

const storeAndCreateDataStore = (user, dataStore) => datalabInfo =>
  dataStorageRepository.createOrUpdate(user, dataStore).then(() => dataStore);

const removeAndDeleteDataStore = (user, dataStore) => datalabInfo =>
  dataStorageRepository.deleteByName(user, dataStore);

export default { createDataStore, deleteDataStore };
