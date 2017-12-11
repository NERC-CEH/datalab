import axios from 'axios';
import logger from 'winston';
import axiosErrorHandler from '../util/errorHandlers';
import datalabRepository from '../dataaccess/datalabRepository';
import dataStorageRepository from '../dataaccess/dataStorageRepository';
import config from '../config';

const VOLUME_URL = `${config.get('infrastructureApi')}/volumes`;
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

const storeAndCreateDataStore = (user, dataStore) => (datalabInfo) => {
  const volumeRequest = {
    ...dataStore,
    linkToStorage: `http://${dataStore.name}-minio.${datalabInfo.domain}/minio`,
    internalEndpoint: `http://${dataStore.name}-minio.${datalabInfo.domain}/minio`,
  };

  return dataStorageRepository.createOrUpdate(user, volumeRequest)
    .then(sendCreationRequest(volumeRequest, datalabInfo))
    .then(() => dataStore);
};

const sendCreationRequest = (datalabRequest, datalabInfo) => () => {
  const payload = {
    datalabInfo,
    name: datalabRequest.name,
    volumeSize: datalabRequest.capacityTotal,
  };

  logger.debug(`Create Request Url: ${VOLUME_URL} payload ${JSON.stringify(payload)}`);
  return axios.post(VOLUME_URL, payload)
    .then(response => logger.info(response.data));
};

const removeAndDeleteDataStore = (user, dataStore) => datalabInfo =>
  sendDeletionRequest(user, dataStore, datalabInfo)
    .then(dataStorageRepository.deleteByName(user, dataStore));

const sendDeletionRequest = (user, dataStore, datalabInfo) => {
  const payload = {
    datalabInfo,
    name: dataStore.name,
  };

  logger.debug(`Deletion Request Url: ${VOLUME_URL} payload ${JSON.stringify(payload)}`);
  return axios.delete(VOLUME_URL, { data: payload })
    .then(response => logger.info(response.data));
};

export default { createDataStore, deleteDataStore };
