import dataStorageActions, {
  LOAD_DATASTORAGE_ACTION,
  LOAD_DATASTORE_ACTION,
  OPEN_MINIO_DATASTORE_ACTION,
} from './dataStorageActions';
import dataStorageService from '../api/dataStorageService';
import minioService from '../api/minioService';

jest.mock('../api/dataStorageService');
jest.mock('../api/minioService');

describe('dataStorageActions', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('calls correct service for', () => {
    it('loadDataStorage', () => {
      // Arrange
      const loadDataStorageMock = jest.fn().mockReturnValue('expectedDataStoragePayload');
      dataStorageService.loadDataStorage = loadDataStorageMock;

      // Act
      const output = dataStorageActions.loadDataStorage();

      // Assert
      expect(loadDataStorageMock).toHaveBeenCalledTimes(1);
      expect(output.type).toBe('LOAD_DATASTORAGE');
      expect(output.payload).toBe('expectedDataStoragePayload');
    });

    it('loadDataStore', () => {
      // Arrange
      const loadDataStoreMock = jest.fn().mockReturnValue('expectedDataStorePayload');
      dataStorageService.loadDataStore = loadDataStoreMock;

      // Act
      const output = dataStorageActions.loadDataStore(123);

      // Assert
      expect(loadDataStoreMock).toHaveBeenCalledTimes(1);
      expect(loadDataStoreMock).toHaveBeenCalledWith(123);
      expect(output.type).toBe('LOAD_DATASTORE');
      expect(output.payload).toBe('expectedDataStorePayload');
    });

    it('openMinioDataStore', () => {
      // Arrange
      const minioMock = jest.fn().mockReturnValue('expectedDataStorePayload');
      minioService.openStorage = minioMock;

      // Act
      const output = dataStorageActions.openMinioDataStore('url', 'token');

      // Assert
      expect(minioMock).toHaveBeenCalledTimes(1);
      expect(minioMock).toHaveBeenCalledWith('url', 'token');
      expect(output.type).toBe(OPEN_MINIO_DATASTORE_ACTION);
      expect(output.payload).toBe('expectedDataStorePayload');
    });
  });

  describe('exports correct values for', () => {
    it('LOAD_DATASTORAGE_ACTION', () => {
      expect(LOAD_DATASTORAGE_ACTION).toBe('LOAD_DATASTORAGE');
    });

    it('LOAD_DATASTORE_ACTION', () => {
      expect(LOAD_DATASTORE_ACTION).toBe('LOAD_DATASTORE');
    });
  });
});
