import notebookRepository from './notebookRepository';
import database from '../config/database';
import databaseMock from './testUtil/databaseMock';

jest.mock('../config/database');

const testNotebooks = [
  { name: 'Notebook 1' },
  { name: 'Notebook 2' },
];
database.getModel = databaseMock(testNotebooks);

describe('notebookRepository', () => {
  it('getAll returns expected snapshot', () => {
    notebookRepository.getAll('user').then((notebooks) => {
      expect(notebooks).toMatchSnapshot();
    });
  });

  it('getById returns expected snapshot', () => {
    notebookRepository.getById(undefined, 1).then((notebook) => {
      expect(notebook).toMatchSnapshot();
    });
  });
});
