import { generateCreateElement, generateDeleteElement } from './infrastructureApiGenerators';
import dataStorageRepository from '../dataaccess/dataStorageRepository';
import { DELETED } from '../models/dataStorage.model';

/**
 * Promise chain sequence for the infrastructure API is common between data
 * storage and stacks. The code for this has been refactored to generator
 * functions, for create and delete. The infrastructure API requests and
 * payloads are different for data storage and stacks; these are created using
 * functions that are given as part of the configuration.
 * */

const baseConfig = {
  apiRoute: 'volume',
  elementName: 'data store',
};

export const createDataStoreRequest = (dataStore, datalabInfo) => ({
  ...dataStore,
  url: `https://${dataStore.projectKey}-${dataStore.name}.${datalabInfo.domain}/minio`,
  internalEndpoint: `http://minio-${dataStore.name}/minio`,
});

export const createDataStorePayload = (datalabRequest, datalabInfo) => ({
  datalabInfo,
  ...datalabRequest,
});

export const deleteDataStorePayload = (dataStore, datalabInfo) => ({
  datalabInfo,
  projectKey: dataStore.projectKey,
  name: dataStore.name,
});

const createDataStore = generateCreateElement({
  ...baseConfig,
  generateApiRequest: createDataStoreRequest,
  generateApiPayload: createDataStorePayload,
  createOrUpdateRecord: dataStorageRepository.createOrUpdate,
});

const tagAsDeleted = (user, { name }) => {
  // Tag datastore as deleted but record will remain in db.
  const updatedRecord = { status: DELETED };
  return Promise.resolve(dataStorageRepository.update(user, name, updatedRecord));
};

const deleteDataStore = generateDeleteElement({
  ...baseConfig,
  generateApiPayload: deleteDataStorePayload,
  deleteRecord: tagAsDeleted,
});

export default { createDataStore, deleteDataStore };
