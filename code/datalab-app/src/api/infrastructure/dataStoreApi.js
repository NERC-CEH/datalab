import { generateCreateElement, generateDeleteElement } from './infrastructureApiGenerators';
import dataStorageRepository from '../dataaccess/dataStorageRepository';

const baseConfig = {
  apiRoute: 'volumes',
  elementName: 'data store',
  elementRepository: dataStorageRepository,
};

const createDataStore = generateCreateElement({
  ...baseConfig,
  generateApiRequest: (dataStore, datalabInfo) => ({
    ...dataStore,
    linkToStorage: `http://${dataStore.name}-minio.${datalabInfo.domain}/minio`,
    internalEndpoint: `http://${dataStore.name}-minio.${datalabInfo.domain}/minio`,
  }),
  generateApiPayload: (datalabRequest, datalabInfo) => ({
    datalabInfo,
    name: datalabRequest.name,
    volumeSize: datalabRequest.capacityTotal,
  }),
});

const deleteDataStore = generateDeleteElement({
  ...baseConfig,
  generateApiPayload: (dataStore, datalabInfo) => ({
    datalabInfo,
    name: dataStore.name,
  }),
});

export default { createDataStore, deleteDataStore };
