import internalNameChecker from './internalNameChecker';
import dataStorageRepository from './dataStorageRepository';
import stackService from './stackService';

jest.mock('../dataaccess/dataStorageRepository');
jest.mock('../dataaccess/stackService');

const dataStoreGetAllByNameMock = jest.fn().mockReturnValue(Promise.resolve());
const stacksGetByNameMock = jest.fn().mockReturnValue(Promise.resolve());

dataStorageRepository.getAllByName = dataStoreGetAllByNameMock;
stackService.getByName = stacksGetByNameMock;

describe('checkNameUniqueness', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls repositories with correct arguments', () => {
    expect(dataStoreGetAllByNameMock).not.toHaveBeenCalled();
    expect(stacksGetByNameMock).not.toHaveBeenCalled();

    return internalNameChecker('expectedUser', 'expectedName')
      .then(() => {
        expect(dataStoreGetAllByNameMock).toHaveBeenCalledWith('expectedUser', 'expectedName');
        expect(stacksGetByNameMock).toHaveBeenCalledWith('expectedUser', 'expectedName');
      });
  });

  it('returns true if both ids are NULL', () => {
    dataStoreGetAllByNameMock.mockReturnValue(Promise.resolve(null));
    stacksGetByNameMock.mockReturnValue(Promise.resolve(null));

    return internalNameChecker('expectedUser', 'expectedName')
      .then(response => expect(response).toBe(true));
  });

  it('returns false if dataStore has a matching id', () => {
    dataStoreGetAllByNameMock.mockReturnValue(Promise.resolve({ id: 'id' }));
    stacksGetByNameMock.mockReturnValue(Promise.resolve(null));

    return internalNameChecker('expectedUser', 'expectedName')
      .then(response => expect(response).toBe(false));
  });

  it('returns false if stacks has a matching id', () => {
    dataStoreGetAllByNameMock.mockReturnValue(Promise.resolve(null));
    stacksGetByNameMock.mockReturnValue(Promise.resolve({ id: 'id' }));

    return internalNameChecker('expectedUser', 'expectedName')
      .then(response => expect(response).toBe(false));
  });
});
