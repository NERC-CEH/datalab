import mockClient from './graphqlClient';
import dataStorageService from './dataStorageService';

jest.mock('./graphqlClient');

describe('dataStorageService', () => {
  beforeEach(() => mockClient.clearResult());

  describe('loadDataStorage', () => {
    it('should build the correct query and unpack the results', () => {
      mockClient.prepareSuccess({ dataStorage: 'expectedValue' });

      dataStorageService.loadDataStorage('project99').then((response) => {
        expect(response).toEqual('expectedValue');
        expect(mockClient.lastQuery()).toMatchSnapshot();
      });
    });

    it('should throw an error if the query fails', async () => {
      mockClient.prepareFailure('error');
      let error;
      try {
        await dataStorageService.loadDataStorage('project99');
      } catch (err) {
        error = err;
      }
      expect(error).toEqual({ error: 'error' });
    });
  });

  describe('getCredentials', () => {
    it('should build the correct query and return the minio credentials', () => {
      const data = { dataStore: { url: 'expectedUrl', accessKey: 'expectedKey' } };
      const queryParams = { projectKey: 'project99', id: 'idValue' };
      mockClient.prepareSuccess(data);

      dataStorageService.getCredentials(queryParams.projectKey, queryParams.id).then((response) => {
        expect(response).toEqual(data.dataStore);
        expect(mockClient.lastQuery()).toMatchSnapshot();
        expect(mockClient.lastOptions()).toEqual(queryParams);
      });
    });

    it('should throw an error if the query fails', async () => {
      mockClient.prepareFailure('error');
      let error;
      try {
        await dataStorageService.getCredentials();
      } catch (err) {
        error = err;
      }
      expect(error).toEqual({ error: 'error' });
    });
  });

  describe('createDataStore', () => {
    it('should build the correct correct mutation and unpack the results', () => {
      const data = { projectKey: 'project99', dataStore: { name: 'name' } };
      mockClient.prepareSuccess(data);

      dataStorageService.createDataStore(data.projectKey, data.dataStore).then((response) => {
        expect(mockClient.lastQuery()).toMatchSnapshot();
        expect(mockClient.lastOptions()).toEqual(data);
      });
    });

    it('should throw an error if the mutation fails', async () => {
      const data = { projectKey: 'project99', dataStore: { name: 'name' } };
      mockClient.prepareFailure('error');
      let error;
      try {
        await dataStorageService.createDataStore(data.projectKey, data.dataStore);
      } catch (err) {
        error = err;
      }
      expect(error).toEqual({ error: 'error' });
    });
  });

  describe('deleteDataStore', () => {
    it('should build the correct correct mutation and unpack the results', () => {
      const data = { dataStore: { name: 'name' } };
      mockClient.prepareSuccess(data);

      dataStorageService.deleteDataStore(data.dataStore).then((response) => {
        expect(mockClient.lastQuery()).toMatchSnapshot();
        expect(mockClient.lastOptions()).toEqual(data);
      });
    });

    it('should throw an error if the mutation fails', async () => {
      const data = { dataStore: { name: 'name' } };
      mockClient.prepareFailure('error');
      let error;
      try {
        await dataStorageService.deleteDataStore(data.dataStore);
      } catch (err) {
        error = err;
      }
      expect(error).toEqual({ error: 'error' });
    });
  });

  describe('addUserToDataStore', () => {
    it('should build the correct correct mutation and unpack the results', () => {
      const data = { dataStore: { name: 'name', user: ['userId'] } };
      mockClient.prepareSuccess(data);

      dataStorageService.addUserToDataStore(data.dataStore).then((response) => {
        expect(mockClient.lastQuery()).toMatchSnapshot();
        expect(mockClient.lastOptions()).toEqual(data);
      });
    });

    it('should throw an error if the mutation fails', async () => {
      const data = { dataStore: { name: 'name', user: ['userId'] } };
      mockClient.prepareFailure('error');
      let error;
      try {
        await dataStorageService.addUserToDataStore(data.dataStore);
      } catch (err) {
        error = err;
      }
      expect(error).toEqual({ error: 'error' });
    });
  });

  describe('removeUserFromDataStore', () => {
    it('should build the correct correct mutation and unpack the results', () => {
      const data = { dataStore: { name: 'name', user: ['userId'] } };
      mockClient.prepareSuccess(data);

      dataStorageService.removeUserFromDataStore(data.dataStore).then((response) => {
        expect(mockClient.lastQuery()).toMatchSnapshot();
        expect(mockClient.lastOptions()).toEqual(data);
      });
    });

    it('should throw an error if the mutation fails', async () => {
      const data = { dataStore: { name: 'name', user: ['userId'] } };
      mockClient.prepareFailure('error');
      let error;
      try {
        await dataStorageService.removeUserFromDataStore(data.dataStore);
      } catch (err) {
        error = err;
      }
      expect(error).toEqual({ error: 'error' });
    });
  });
});
