import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import datalabRepository from '../dataaccess/datalabRepository';
import dataStorageRepository from '../dataaccess/dataStorageRepository';
import config from '../config';
import dataStoreApi from './dataStoreApi';

jest.mock('../dataaccess/datalabRepository');
jest.mock('../dataaccess/dataStorageRepository');

const mockGetDatalabByName = jest.fn();
datalabRepository.getByName = mockGetDatalabByName;

const mockCreateDataStore = jest.fn();
dataStorageRepository.createOrUpdate = mockCreateDataStore;

const mockDeleteDataStore = jest.fn();
dataStorageRepository.deleteByName = mockDeleteDataStore;

const VOLUME_CREATION_URL = `${config.get('infrastructureApi')}/volumes`;

const httpMock = new MockAdapter(axios);
const datalabInfo = { name: 'testlab', domain: 'test-datalabs.nerc.ac.uk' };
const dataStoreName = 'volumeName';
const dataStoreType = 1;

describe('Volume API', () => {
  beforeEach(() => {
    httpMock.reset();
  });

  afterAll(() => {
    httpMock.restore();
  });

  describe('create volume', () => {
    it('should store the data store details and send a create request', () => {
      mockGetDatalabByName.mockReturnValue(Promise.resolve(datalabInfo));
      mockCreateDataStore.mockReturnValue(Promise.resolve({}));

      httpMock.onPost(VOLUME_CREATION_URL)
        .reply(201);

      const dataStoreRequest = { name: dataStoreName, type: dataStoreType };
      dataStoreApi.createDataStore(undefined, datalabInfo, dataStoreRequest)
        .then((response) => {
          expect(response).toMatchSnapshot();
        });
    });

    it('should handle creation api errors', () => {
      mockGetDatalabByName.mockReturnValue(Promise.resolve(datalabInfo));
      mockCreateDataStore.mockReturnValue(Promise.resolve({}));

      httpMock.onPost(VOLUME_CREATION_URL)
        .reply(400);

      const dataStoreRequest = { name: dataStoreName, type: dataStoreType };
      dataStoreApi.createDataStore(undefined, datalabInfo, dataStoreRequest)
        .catch((error) => {
          expect(error).toMatchSnapshot();
        });
    });

    it('should send a deletion request and remove data store record', () => {
      mockGetDatalabByName.mockReturnValue(Promise.resolve(datalabInfo));
      mockDeleteDataStore.mockReturnValue(Promise.resolve({}));

      httpMock.onDelete(VOLUME_CREATION_URL)
        .reply(201);

      const dataStoreRequest = { name: dataStoreName };
      dataStoreApi.deleteDataStore(undefined, datalabInfo, dataStoreRequest)
        .then((response) => {
          expect(response).toMatchSnapshot();
        });
    });

    it('should handle deletion api errors', () => {
      mockGetDatalabByName.mockReturnValue(Promise.resolve(datalabInfo));
      mockDeleteDataStore.mockReturnValue(Promise.resolve({}));

      httpMock.onPost(VOLUME_CREATION_URL)
        .reply(400);

      const dataStoreRequest = { name: dataStoreName, type: dataStoreType };
      dataStoreApi.deleteDataStore(undefined, datalabInfo, dataStoreRequest)
        .catch((error) => {
          expect(error).toMatchSnapshot();
        });
    });
  });
});
