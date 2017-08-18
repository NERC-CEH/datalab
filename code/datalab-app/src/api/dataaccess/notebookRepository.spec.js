import notebookRepository from './notebookRepository';
import database from '../config/database';

jest.mock('../config/database');

const testNotebooks = [
  { name: 'Notebook 1' },
  { name: 'Notebook 2' },
];
database.getModel = createDatabaseMock(testNotebooks);

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

function createDatabaseMock(notebooks) {
  return () => ({
    find: () => ({ exec: () => Promise.resolve(notebooks) }),
    findOne: queryObject => ({ exec: () => Promise.resolve(notebooks[0]) }),
  });
}
