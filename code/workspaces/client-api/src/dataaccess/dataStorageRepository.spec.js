import dataStorageRepository from './dataStorageRepository';
import database from '../config/database';
import databaseMock from './testUtil/databaseMock';

jest.mock('../config/database');

const testStorage = [
  { name: 'Storage 1' },
  { name: 'Storage 2' },
];

const user = { sub: 'username' };

const mockDatabase = databaseMock(testStorage);
database.getModel = mockDatabase;

describe('dataStorageRepository', () => {
  beforeEach(() => {
    mockDatabase().clear();
  });

  it('getAll returns expected snapshot', () => dataStorageRepository.getAllActive(user).then((storage) => {
    // Filters for record with status not equal to deleted.
    expect(mockDatabase().query()).toEqual({
      status: { $ne: 'deleted' },
      users: { $elemMatch: { $eq: 'username' } },
    });
    expect(storage).toMatchSnapshot();
  }));

  it('getAllByName returns expected snapshot', () => dataStorageRepository.getAllByName(user, 'expectedName').then((storage) => {
    expect(mockDatabase().query()).toEqual({
      name: 'expectedName',
    });
    expect(storage).toMatchSnapshot();
  }));

  it('getById returns expected snapshot', () => dataStorageRepository.getById(user, '599aa983bdd5430daedc8eec').then((storage) => {
    expect(mockDatabase().query()).toEqual({
      _id: '599aa983bdd5430daedc8eec',
      users: { $elemMatch: { $eq: 'username' } },
    });
    expect(storage).toMatchSnapshot();
  }));

  it('getByName returns expected snapshot', () => dataStorageRepository.getByName(user, 'expectedName').then((storage) => {
    expect(mockDatabase().query()).toEqual({
      name: 'expectedName',
      users: { $elemMatch: { $eq: 'username' } },
    });
    expect(storage).toMatchSnapshot();
  }));

  it('createOrUpdate should query for data store with same name', () => {
    const dataStore = { name: 'newVolume', type: 'nfs' };

    return dataStorageRepository.createOrUpdate(user, dataStore)
      .then((createdDataStore) => {
        expect(mockDatabase().query()).toEqual({
          name: createdDataStore.name,
          users: { $elemMatch: { $eq: 'username' } },
        });
        expect(mockDatabase().entity()).toEqual(createdDataStore);
        expect(mockDatabase().params()).toEqual({ upsert: true, setDefaultsOnInsert: true });
      });
  });

  it('deleteByName should query for data store with same name', () => {
    const name = 'oldVolume';

    return dataStorageRepository.deleteByName(user, name)
      .then(() => {
        expect(mockDatabase().query()).toEqual({ name, users: { $elemMatch: { $eq: 'username' } } });
      });
  });

  it('update should use correct operators to overwrite fields', () => {
    const name = 'deletedVolume';
    const updateObject = { status: 'deleted' };

    return dataStorageRepository.update(user, name, updateObject)
      .then(() => {
        expect(mockDatabase().query()).toEqual({ name });
        expect(mockDatabase().entity()).toEqual({
          $set: { status: 'deleted' },
        });
        expect(mockDatabase().params()).toEqual({ upsert: false });
      });
  });

  it('addUser should use correct operators to update users array', () => {
    const name = 'volume';
    const userIds = ['user1', 'users2'];

    return dataStorageRepository.addUsers(user, name, userIds)
      .then(() => {
        expect(mockDatabase().query()).toEqual({ name });
        expect(mockDatabase().entity()).toEqual({
          $addToSet: { users: { $each: userIds } },
        });
        expect(mockDatabase().params()).toEqual({ upsert: false });
      });
  });

  it('removeUser should use correct operators to update users array', () => {
    const name = 'volume';
    const userIds = ['user1', 'users2'];

    return dataStorageRepository.removeUsers(user, name, userIds)
      .then(() => {
        expect(mockDatabase().query()).toEqual({ name });
        expect(mockDatabase().entity()).toEqual({
          $pull: { users: { $in: userIds } },
        });
        expect(mockDatabase().params()).toEqual({ upsert: false });
      });
  });
});
