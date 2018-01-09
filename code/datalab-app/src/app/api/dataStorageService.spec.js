import mockClient from './graphqlClient';
import dataStorageService from './dataStorageService';

jest.mock('./graphqlClient');

describe('dataStorageService', () => {
  beforeEach(() => mockClient.clearResult());

  describe('loadDataStorage', () => {
    it('should build the correct query and unpack the results', () => {
      mockClient.prepareSuccess({ dataStorage: 'expectedValue' });

      return dataStorageService.loadDataStorage().then((response) => {
        expect(response).toEqual('expectedValue');
        expect(mockClient.lastQuery()).toMatchSnapshot();
      });
    });

    it('should throw an error if the query fails', () => {
      mockClient.prepareFailure('error');

      return dataStorageService.loadDataStorage().catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });

  describe('loadDataStore', () => {
    it('should build the correct query and return the data store', () => {
      const data = { dataStorage: { name: 'expectedName' } };
      const queryParams = { dataStoreId: 'id' };
      mockClient.prepareSuccess(data);

      return dataStorageService.loadDataStore(queryParams.dataStoreId).then((response) => {
        expect(response).toEqual(data.dataStorage);
        expect(mockClient.lastQuery()).toMatchSnapshot();
        expect(mockClient.lastOptions()).toEqual(queryParams);
      });
    });

    it('should throw an error if the query fails', () => {
      mockClient.prepareFailure('error');

      return dataStorageService.loadDataStore().catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });

  describe('createDataStore', () => {
    it('should build the correct correct mutation and unpack the results', () => {
      const data = { dataStore: { name: 'name' } };
      mockClient.prepareSuccess(data);

      return dataStorageService.createDataStore(data.dataStore).then((response) => {
        expect(mockClient.lastQuery()).toMatchSnapshot();
        expect(mockClient.lastOptions()).toEqual(data);
      });
    });

    it('should throw an error if the mutation fails', () => {
      const data = { dataStore: { name: 'name' } };
      mockClient.prepareFailure('error');

      return dataStorageService.createDataStore(data.dataStore).catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });

  describe('deleteDataStore', () => {
    it('should build the correct correct mutation and unpack the results', () => {
      const data = { dataStore: { name: 'name' } };
      mockClient.prepareSuccess(data);

      return dataStorageService.deleteDataStore(data.dataStore).then((response) => {
        expect(mockClient.lastQuery()).toMatchSnapshot();
        expect(mockClient.lastOptions()).toEqual(data);
      });
    });

    it('should throw an error if the mutation fails', () => {
      const data = { dataStore: { name: 'name' } };
      mockClient.prepareFailure('error');

      return dataStorageService.deleteDataStore(data.dataStore).catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });
});
