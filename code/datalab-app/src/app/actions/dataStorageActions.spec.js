import dataStorageActions, {
  LOAD_DATASTORAGE_ACTION,
  LOAD_DATASTORE_ACTION,
  OPEN_MINIO_DATASTORE_ACTION,
  CREATE_DATASTORE_ACTION,
  DELETE_DATASTORE_ACTION,
} from './dataStorageActions';
import dataStorageService from '../api/dataStorageService';
import minioService from '../api/minioService';

jest.mock('../api/dataStorageService');
jest.mock('../api/minioService');

const dataStore = { name: 'expectedName', capacityTotal: 12 };

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

    it('createDataStore', () => {
      // Arrange
      const createDataStoreMock = jest.fn().mockReturnValue('expectedCreationPayload');
      dataStorageService.createDataStore = createDataStoreMock;

      // Act
      const output = dataStorageActions.createDataStore(dataStore);

      // Assert
      expect(createDataStoreMock).toHaveBeenCalledTimes(1);
      expect(createDataStoreMock).toHaveBeenCalledWith(dataStore);
      expect(output.type).toBe(CREATE_DATASTORE_ACTION);
      expect(output.payload).toBe('expectedCreationPayload');
    });

    it('deleteDataStore', () => {
      // Arrange
      const deleteDataStoreMock = jest.fn().mockReturnValue('expectedDeletionPayload');
      dataStorageService.deleteDataStore = deleteDataStoreMock;

      // Act
      const output = dataStorageActions.deleteDataStore(dataStore);

      // Assert
      expect(deleteDataStoreMock).toHaveBeenCalledTimes(1);
      expect(deleteDataStoreMock).toHaveBeenCalledWith({ name: dataStore.name });
      expect(output.type).toBe(DELETE_DATASTORE_ACTION);
      expect(output.payload).toBe('expectedDeletionPayload');
    });
  });

  describe('exports correct values for', () => {
    it('LOAD_DATASTORAGE_ACTION', () => {
      expect(LOAD_DATASTORAGE_ACTION).toBe('LOAD_DATASTORAGE');
    });

    it('LOAD_DATASTORE_ACTION', () => {
      expect(LOAD_DATASTORE_ACTION).toBe('LOAD_DATASTORE');
    });

    it('OPEN_MINIO_DATASTORE_ACTION', () => {
      expect(OPEN_MINIO_DATASTORE_ACTION).toBe('OPEN_MINIO_DATASTORE');
    });

    it('CREATE_DATASTORE_ACTION', () => {
      expect(CREATE_DATASTORE_ACTION).toBe('CREATE_DATASTORE');
    });

    it('DELETE_DATASTORE_ACTION', () => {
      expect(DELETE_DATASTORE_ACTION).toBe('DELETE_DATASTORE');
    });
  });
});
