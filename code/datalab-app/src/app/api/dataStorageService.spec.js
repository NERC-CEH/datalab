import axios from 'axios';
import dataStorageService from './dataStorageService';

jest.mock('axios');

describe('dataStorageService', () => {
  beforeEach(() => jest.resetAllMocks());

  const createResolvedResponse = data => Promise.resolve({ data: { data } });

  const createRejectedResponse = error => Promise.reject(error);

  describe('loadDataStorage', () => {
    it('should submit a post request for the data storage and unpack response', () => {
      // Arrange
      const postMock = jest.fn()
        .mockReturnValue(createResolvedResponse({ dataStorage: 'expectedDataStoragePayload' }));
      axios.post = postMock;

      // Act
      const output = dataStorageService.loadDataStorage();

      // Assert
      output.then(response => expect(response).toBe('expectedDataStoragePayload'));
    });

    it('call submits post request with correct body', () => {
      // Arrange
      const postMock = jest.fn()
        .mockReturnValue(createResolvedResponse());
      axios.post = postMock;

      // Act
      dataStorageService.loadDataStorage();

      // Assert
      expect(postMock.mock.calls).toMatchSnapshot();
    });

    it('should throw error if post fails', () => {
      // Arrange
      const postMock = jest.fn()
        .mockReturnValue(createRejectedResponse('expectedBadRequest'));
      axios.post = postMock;

      // Act
      const output = dataStorageService.loadDataStorage();

      // Assert
      output.catch(response => expect(response).toBe('expectedBadRequest'));
    });
  });

  describe('loadDataStore', () => {
    it('should submit a post request for the data storage and unpack response', () => {
      // Arrange
      const postMock = jest.fn()
        .mockReturnValue(createResolvedResponse({ dataStore: 'expectedDataStorePayload' }));
      axios.post = postMock;

      // Act
      const output = dataStorageService.loadDataStore(123);

      // Assert
      output.then(response => expect(response).toBe('expectedDataStorePayload'));
    });

    it('call submits post request with correct body', () => {
      // Arrange
      const postMock = jest.fn()
        .mockReturnValue(createResolvedResponse());
      axios.post = postMock;

      // Act
      dataStorageService.loadDataStore(123);

      // Assert
      expect(postMock.mock.calls).toMatchSnapshot();
    });

    it('should throw error if post fails', () => {
      // Arrange
      const postMock = jest.fn()
        .mockReturnValue(createRejectedResponse('expectedBadRequest'));
      axios.post = postMock;

      // Act
      const output = dataStorageService.loadDataStore(123);

      // Assert
      output.catch(response => expect(response).toBe('expectedBadRequest'));
    });
  });
});
