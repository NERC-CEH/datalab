import {
  createDataStoreRequest,
  createDataStorePayload,
  deleteDataStorePayload,
} from './dataStoreApi';

jest.mock('../dataaccess/dataStorageRepository');

const datalabInfo = { name: 'testlab', domain: 'test-datalabs.nerc.ac.uk' };

describe('Data Storage API configuration', () => {
  it('should give correct API request for creation', () => {
    const dataStore = { name: 'dataStoreName', capacityTotal: 12 };

    expect(createDataStoreRequest(dataStore, datalabInfo)).toMatchSnapshot();
  });

  it('should give correct API payload for creation', () => {
    const datalabRequest = {
      name: 'dataStoreName',
      capacityTotal: 12,
      linkToStorage: 'http://notebookName-minio.test-datalabs.nerc.ac.uk/minio',
      internalEndpoint: 'http://notebookName-minio.test-datalabs.nerc.ac.uk/minio',
    };

    expect(createDataStorePayload(datalabRequest, datalabInfo)).toMatchSnapshot();
  });

  it('should give correct API payload for deletion', () => {
    const dataStore = { name: 'dataStoreName', capacityTotal: 12 };

    expect(deleteDataStorePayload(dataStore, datalabInfo)).toMatchSnapshot();
  });
});
