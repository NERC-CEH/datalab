import {
  createDataStoreRequest,
  createDataStorePayload,
  deleteDataStorePayload,
} from './dataStoreApi';

jest.mock('../dataaccess/dataStorageRepository');

const datalabInfo = { name: 'testlab', domain: 'test-datalabs.nerc.ac.uk' };

describe('Data Storage API configuration', () => {
  it('should give correct API request for creation', () => {
    const dataStore = {
      name: 'expectedName',
      displayName: 'expectedDisplayName',
      description: 'expected description',
      storageType: 2,
      volumeSize: 12,
    };

    expect(createDataStoreRequest(dataStore, datalabInfo)).toMatchSnapshot();
  });

  it('should give correct API payload for creation', () => {
    const datalabRequest = {
      name: 'dataStoreName',
      volumeSize: 12,
      linkToStorage: 'https://notebookName-minio.test-datalabs.nerc.ac.uk/minio',
      extra: 'field',
    };

    expect(createDataStorePayload(datalabRequest, datalabInfo)).toMatchSnapshot();
  });

  it('should give correct API payload for deletion', () => {
    const dataStore = {
      name: 'dataStoreName',
      volumeSize: 12,
      extra: 'field',
    };

    expect(deleteDataStorePayload(dataStore, datalabInfo)).toMatchSnapshot();
  });
});
