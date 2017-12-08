import logger from 'winston';
import axiosErrorHandler from '../util/errorHandlers';
import datalabRepository from '../dataaccess/datalabRepository';
import dataStorageRepository from '../dataaccess/dataStorageRepository';

const CREATE_ERROR_MESSAGE = 'Unable to create Data Store';

function createDataStore(user, datalabName, dataStore) {
  logger.info(`Requesting data store creation for ${dataStore.type} called '${dataStore.name}'`);
  return datalabRepository.getByName(user, datalabName)
    .then(storeAndCreateDataStore(user, dataStore))
    .catch(axiosErrorHandler(CREATE_ERROR_MESSAGE));
}

const storeAndCreateDataStore = (user, dataStore) => datalabInfo =>
  dataStorageRepository.createOrUpdate(user, dataStore).then(() => dataStore);

export default { createDataStore };
