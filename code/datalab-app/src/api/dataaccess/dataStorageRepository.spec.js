import dataStorageRepository from './dataStorageRepository';
import database from '../config/database';
import databaseMock from './testUtil/databaseMock';

jest.mock('../config/database');

const testStorage = [
  { name: 'Storage 1' },
  { name: 'Storage 2' },
];
database.getModel = databaseMock(testStorage);

describe('dataStorageRepository', () => {
  it('getAll returns expected snapshot', () => {
    dataStorageRepository.getAll('user').then((storage) => {
      expect(storage).toMatchSnapshot();
    });
  });

  it('getById returns expected snapshot', () => {
    dataStorageRepository.getById(undefined, 1).then((storage) => {
      expect(storage).toMatchSnapshot();
    });
  });
});
