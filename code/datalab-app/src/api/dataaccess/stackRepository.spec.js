import stackRepository from './stackRepository';
import database from '../config/database';
import databaseMock from './testUtil/databaseMock';

jest.mock('../config/database');

const testStacks = [
  { name: 'Stack 1' },
  { name: 'Stack 2' },
];

const user = { sub: 'username' };

const mockDatabase = databaseMock(testStacks);
database.getModel = mockDatabase;

describe('stackRepository', () => {
  beforeEach(() => {
    mockDatabase().clear();
  });

  it('getAll returns expected snapshot', () =>
    stackRepository.getAll(user).then((stacks) => {
      expect(mockDatabase().query()).toEqual({ users: { $elemMatch: { $eq: 'username' } } });
      expect(stacks).toMatchSnapshot();
    }));

  it('getByCategory returns expected snapshot', () =>
    stackRepository.getByCategory(user, 'analysis').then((stacks) => {
      expect(mockDatabase().query()).toEqual({
        category: 'analysis',
        users: { $elemMatch: { $eq: 'username' } },
      });
      expect(stacks).toMatchSnapshot();
    }));

  it('getById returns expected snapshot', () =>
    stackRepository.getById(user, '599aa983bdd5430daedc8eec').then((stack) => {
      expect(mockDatabase().query()).toEqual({
        _id: '599aa983bdd5430daedc8eec',
        users: { $elemMatch: { $eq: 'username' } },
      });
      expect(stack).toMatchSnapshot();
    }));

  it('getByName returns expected snapshot', () =>
    stackRepository.getByName(user, 'Notebook 1').then((stack) => {
      expect(mockDatabase().query()).toEqual({
        name: 'Notebook 1',
        users: { $elemMatch: { $eq: 'username' } },
      });
      expect(stack).toMatchSnapshot();
    }));

  it('createOrUpdate should query for stacks with same name', () => {
    const notebook = { name: 'Notebook', type: 'jupyter' };
    stackRepository.createOrUpdate(user, notebook).then((createdStack) => {
      expect(mockDatabase().query()).toEqual({
        name: createdStack.name,
        users: { $elemMatch: { $eq: 'username' } },
      });
      expect(mockDatabase().entity()).toEqual(createdStack);
      expect(mockDatabase().params()).toEqual({ upsert: true, setDefaultsOnInsert: true });
    });
  });

  it('deleteByName should query for stacks with same name', () => {
    const name = 'Stack';
    stackRepository.deleteByName(user, name).then(() => {
      expect(mockDatabase().query()).toEqual({ name, users: { $elemMatch: { $eq: 'username' } } });
    });
  });
});
