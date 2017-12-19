import { generateCreateElement, generateDeleteElement } from './infrastructureApiGenerators';
import dataStorageRepository from '../dataaccess/dataStorageRepository';

/**
 * Promise chain sequence for the infrastructure API is common between data
 * storage and stacks. The code for this has been refactored to generator
 * functions, for create and delete. The infrastructure API requests and
 * payloads are different for data storage and stacks; these are created using
 * functions that are given as part of the configuration.
 * */

const baseConfig = {
  apiRoute: 'volumes',
  elementName: 'data store',
  elementRepository: dataStorageRepository,
};

export const createDataStoreRequest = (dataStore, datalabInfo) => ({
  ...dataStore,
  linkToStorage: `https://${dataStore.name}-minio.${datalabInfo.domain}/minio`,
  internalEndpoint: `http://${dataStore.name}-minio.${datalabInfo.domain}/minio`,
});

export const createDataStorePayload = (datalabRequest, datalabInfo) => ({
  datalabInfo,
  name: datalabRequest.name,
  volumeSize: datalabRequest.capacityTotal,
});

export const deleteDateStorePayload = (dataStore, datalabInfo) => ({
  datalabInfo,
  name: dataStore.name,
});

const createDataStore = generateCreateElement({
  ...baseConfig,
  generateApiRequest: createDataStoreRequest,
  generateApiPayload: createDataStorePayload,
});

const deleteDataStore = generateDeleteElement({
  ...baseConfig,
  generateApiPayload: deleteDateStorePayload,
});

export default { createDataStore, deleteDataStore };
