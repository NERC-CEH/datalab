import dataStorageActions, {
  LOAD_DATASTORAGE_ACTION,
  GET_DATASTORE_CREDENTIALS_ACTION,
  OPEN_MINIO_DATASTORE_ACTION,
  CREATE_DATASTORE_ACTION,
  DELETE_DATASTORE_ACTION,
  ADD_USER_TO_DATASTORE_ACTION,
  REMOVE_USER_FROM_DATASTORE_ACTION,
  EDIT_DATASTORE_DETAILS_ACTION,
} from './dataStorageActions';
import dataStorageService from '../api/dataStorageService';
import minioService from '../api/minioService';

jest.mock('../api/dataStorageService');
jest.mock('../api/minioService');

const dataStore = { name: 'expectedName', capacityTotal: 12, users: ['expectedUserId'] };

describe('dataStorageActions', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('calls correct service for', () => {
    it('loadDataStorage', async () => {
      // Arrange
      const loadDataStorageMock = jest.fn().mockResolvedValue('expectedDataStorage');
      dataStorageService.loadDataStorage = loadDataStorageMock;

      // Act
      const output = dataStorageActions.loadDataStorage('project99');

      // Assert
      expect(loadDataStorageMock).toHaveBeenCalledTimes(1);
      expect(loadDataStorageMock).toHaveBeenCalledWith('project99');
      expect(output.type).toBe('LOAD_DATASTORAGE');
      expect(await output.payload).toEqual({ projectKey: 'project99', storage: 'expectedDataStorage' });
    });

    it('getCredentials', () => {
      // Arrange
      const getCredentialsMock = jest.fn().mockReturnValue('expectedDataStorePayload');
      dataStorageService.getCredentials = getCredentialsMock;

      // Act
      const output = dataStorageActions.getCredentials('project99', 123);

      // Assert
      expect(getCredentialsMock).toHaveBeenCalledTimes(1);
      expect(getCredentialsMock).toHaveBeenCalledWith('project99', 123);
      expect(output.type).toBe('GET_DATASTORE_CREDENTIALS');
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
      const output = dataStorageActions.createDataStore('project99', dataStore);

      // Assert
      expect(createDataStoreMock).toHaveBeenCalledTimes(1);
      expect(createDataStoreMock).toHaveBeenCalledWith('project99', dataStore);
      expect(output.type).toBe(CREATE_DATASTORE_ACTION);
      expect(output.payload).toBe('expectedCreationPayload');
    });

    it('deleteDataStore', () => {
      // Arrange
      const deleteDataStoreMock = jest.fn().mockReturnValue('expectedDeletionPayload');
      dataStorageService.deleteDataStore = deleteDataStoreMock;

      // Act
      const output = dataStorageActions.deleteDataStore('project99', dataStore);

      // Assert
      expect(deleteDataStoreMock).toHaveBeenCalledTimes(1);
      expect(deleteDataStoreMock).toHaveBeenCalledWith('project99', { name: dataStore.name });
      expect(output.type).toBe(DELETE_DATASTORE_ACTION);
      expect(output.payload).toBe('expectedDeletionPayload');
    });

    it('addUserToDataStore', () => {
      // Arrange
      const addUserToDataStoreMock = jest.fn().mockReturnValue('expectedPayload');
      dataStorageService.addUserToDataStore = addUserToDataStoreMock;

      // Act
      const output = dataStorageActions.addUserToDataStore('project99', dataStore);

      // Assert
      expect(addUserToDataStoreMock).toHaveBeenCalledTimes(1);
      expect(addUserToDataStoreMock).toHaveBeenCalledWith('project99', { name: dataStore.name, users: dataStore.users });
      expect(output.type).toBe(ADD_USER_TO_DATASTORE_ACTION);
      expect(output.payload).toBe('expectedPayload');
    });

    it('removeUserFromDataStore', () => {
      // Arrange
      const removeUserFromDataStoreMock = jest.fn().mockReturnValue('expectedPayload');
      dataStorageService.removeUserFromDataStore = removeUserFromDataStoreMock;

      // Act
      const output = dataStorageActions.removeUserFromDataStore('project99', dataStore);

      // Assert
      expect(removeUserFromDataStoreMock).toHaveBeenCalledTimes(1);
      expect(removeUserFromDataStoreMock).toHaveBeenCalledWith('project99', { name: dataStore.name, users: dataStore.users });
      expect(output.type).toBe(REMOVE_USER_FROM_DATASTORE_ACTION);
      expect(output.payload).toBe('expectedPayload');
    });

    it('editDataStoreDetails', () => {
      // Arrange
      const editDataStoreDetailsMock = jest.fn().mockReturnValue('expectedPayload');
      dataStorageService.editDataStoreDetails = editDataStoreDetailsMock;

      const updatedDetails = {
        displayName: 'New Display Name',
        description: 'New description',
        users: ['user1', 'user2'],
      };

      // Act
      const output = dataStorageActions.editDataStoreDetails(
        'project99', 'datastorename', updatedDetails,
      );

      // Assert
      expect(editDataStoreDetailsMock).toHaveBeenCalledTimes(1);
      expect(editDataStoreDetailsMock).toHaveBeenCalledWith(
        'project99', 'datastorename', updatedDetails,
      );
      expect(output.type).toBe(EDIT_DATASTORE_DETAILS_ACTION);
      expect(output.payload).toBe('expectedPayload');
    });
  });

  describe('exports correct values for', () => {
    it('LOAD_DATASTORAGE_ACTION', () => {
      expect(LOAD_DATASTORAGE_ACTION).toBe('LOAD_DATASTORAGE');
    });

    it('GET_DATASTORE_CREDENTIALS_ACTION', () => {
      expect(GET_DATASTORE_CREDENTIALS_ACTION).toBe('GET_DATASTORE_CREDENTIALS');
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

    it('ADD_USER_TO_DATASTORE_ACTION', () => {
      expect(ADD_USER_TO_DATASTORE_ACTION).toBe('ADD_USER_TO_DATASTORE');
    });

    it('REMOVE_USER_FROM_DATASTORE_ACTION', () => {
      expect(REMOVE_USER_FROM_DATASTORE_ACTION).toBe('REMOVE_USER_FROM_DATASTORE');
    });

    it('EDIT_DATASTORE_DETAILS_ACTION', () => {
      expect(EDIT_DATASTORE_DETAILS_ACTION).toBe('EDIT_DATASTORE_DETAILS');
    });
  });
});
