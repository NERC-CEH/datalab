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
      expect(mockDatabase().query()).toEqual({});
      expect(storage).toMatchSnapshot();
    }));

  it('getById returns expected snapshot', () =>
    dataStorageRepository.getById(undefined, '599aa983bdd5430daedc8eec').then((storage) => {
      expect(mockDatabase().query()).toEqual({ _id: '599aa983bdd5430daedc8eec' });
      expect(storage).toMatchSnapshot();
    }));
});
