import notebookRepository from './notebookRepository';
import database from '../config/database';
import databaseMock from './testUtil/databaseMock';

jest.mock('../config/database');

const testNotebooks = [
  { name: 'Notebook 1' },
  { name: 'Notebook 2' },
];
const mockDatabase = databaseMock(testNotebooks);
database.getModel = mockDatabase;

describe('notebookRepository', () => {
  beforeEach(() => {
    mockDatabase().clear();
  });

  it('getAll returns expected snapshot', () =>
    notebookRepository.getAll('user').then((notebooks) => {
      expect(mockDatabase().query()).toEqual({});
      expect(notebooks).toMatchSnapshot();
    }));

  it('getById returns expected snapshot', () =>
    notebookRepository.getById(undefined, '599aa983bdd5430daedc8eec').then((notebook) => {
      expect(mockDatabase().query()).toEqual({ _id: '599aa983bdd5430daedc8eec' });
      expect(notebook).toMatchSnapshot();
    }));

  it('getByName returns expected snapshot', () =>
    notebookRepository.getByName(undefined, 'Notebook 1').then((notebook) => {
      expect(mockDatabase().query()).toEqual({ name: 'Notebook 1' });
      expect(notebook).toMatchSnapshot();
    }));

  it('createOrUpdate should query for notebooks with same name', () => {
    const notebook = { name: 'Notebook', type: 'jupyter' };
    notebookRepository.createOrUpdate(undefined, notebook).then((createdNotebook) => {
      expect(mockDatabase().query()).toEqual({ name: createdNotebook.name });
      expect(mockDatabase().entity()).toEqual(createdNotebook);
      expect(mockDatabase().params()).toEqual({ upsert: true, setDefaultsOnInsert: true });
    });
  });

  it('deleteByName should query for notebooks with same name', () => {
    const name = 'Notebook';
    notebookRepository.deleteByName(undefined, name).then((createdNotebook) => {
      expect(mockDatabase().query()).toEqual({ name });
    });
  });
});
