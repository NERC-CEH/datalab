import dataStorageRepository from './dataStorageRepository';
import database from '../config/database';
import databaseMock from './testUtil/databaseMock';

jest.mock('../config/database');

const testStorage = [
  { name: 'Storage 1' },
  { name: 'Storage 2' },
];
const mockDatabase = databaseMock(testStorage);
database.getModel = mockDatabase;

describe('dataStorageRepository', () => {
  beforeEach(() => {
    mockDatabase().clear();
  });

  it('getAll returns expected snapshot', () =>
    dataStorageRepository.getAll('user').then((storage) => {
      // Filters for record with status not equal to deleted.
      expect(mockDatabase().query()).toEqual({ status: { $ne: 'deleted' } });
      expect(storage).toMatchSnapshot();
    }));

  it('getById returns expected snapshot', () =>
    dataStorageRepository.getById(undefined, '599aa983bdd5430daedc8eec').then((storage) => {
      expect(mockDatabase().query()).toEqual({ _id: '599aa983bdd5430daedc8eec' });
      expect(storage).toMatchSnapshot();
    }));

  it('getByName returns expected snapshot', () =>
    dataStorageRepository.getByName(undefined, 'expectedName').then((storage) => {
      expect(mockDatabase().query()).toEqual({ name: 'expectedName' });
      expect(storage).toMatchSnapshot();
    }));

  it('createOrUpdate should query for data store with same name', () => {
    const dataStore = { name: 'newVolume', type: 'nfs' };
    dataStorageRepository.createOrUpdate(undefined, dataStore).then((createdDataStore) => {
      expect(mockDatabase().query()).toEqual({ name: createdDataStore.name });
      expect(mockDatabase().entity()).toEqual(createdDataStore);
      expect(mockDatabase().params()).toEqual({ upsert: true, setDefaultsOnInsert: true });
    });
  });

  it('deleteByName should query for data store with same name', () => {
    const name = 'oldVolume';
    dataStorageRepository.deleteByName(undefined, name).then(() => {
      expect(mockDatabase().query()).toEqual({ name });
    });
  });

  it('update should use correct operators to overwrite fields', () => {
    const name = 'deletedVolume';
    const updateObject = { status: 'deleted' };
    dataStorageRepository.update(undefined, name, updateObject).then(() => {
      expect(mockDatabase().query()).toEqual({ name });
      expect(mockDatabase().entity()).toEqual({ $set: { status: 'deleted' } });
      expect(mockDatabase().params()).toEqual({ upsert: false });
    });
  });
});
