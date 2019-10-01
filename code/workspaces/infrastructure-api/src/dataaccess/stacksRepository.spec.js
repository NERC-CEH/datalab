import stacksRepository from './stacksRepository';
import database from '../config/database';
import databaseMock from './testUtil/databaseMock';

jest.mock('../config/database');

const testStacks = [
  { name: 'Stack 1' },
  { name: 'Stack 2' },
];

const user = { sub: 'username' };
const project = 'expectedProject';

const mockDatabase = databaseMock(testStacks);
database.getModel = mockDatabase;

describe('stacksRepository', () => {
  beforeEach(() => {
    mockDatabase().clear();
  });

  it('getAll returns expected snapshot', () => stacksRepository.getAll(user).then((stacks) => {
    expect(mockDatabase().user()).toBe('username');
    expect(stacks).toMatchSnapshot();
  }));

  it('getAllByCategory returns expected snapshot', () => stacksRepository.getAllByCategory(project, user, 'analysis').then((stacks) => {
    expect(mockDatabase().query()).toEqual({ category: 'analysis' });
    expect(mockDatabase().project()).toBe('expectedProject');
    expect(mockDatabase().user()).toBe('username');
    expect(stacks).toMatchSnapshot();
  }));

  it('getAllByVolumeMount returns expected snapshot', () => stacksRepository.getAllByVolumeMount(project, user, 'expectedVolume').then((stacks) => {
    expect(mockDatabase().query()).toEqual({ volumeMount: 'expectedVolume' });
    expect(mockDatabase().project()).toBe('expectedProject');
    expect(mockDatabase().user()).toBe(undefined); // All users
    expect(stacks).toMatchSnapshot();
  }));

  it('getById returns expected snapshot', () => stacksRepository.getOneById(project, user, '599aa983bdd5430daedc8eec').then((stack) => {
    expect(mockDatabase().query()).toEqual({ _id: '599aa983bdd5430daedc8eec' });
    expect(mockDatabase().user()).toBe('username');
    expect(stack).toMatchSnapshot();
  }));

  it('getOneByName returns expected snapshot', () => stacksRepository.getOneByName(project, user, 'Notebook 1').then((stack) => {
    expect(mockDatabase().query()).toEqual({ name: 'Notebook 1' });
    expect(mockDatabase().project()).toBe('expectedProject');
    expect(mockDatabase().user()).toBe(undefined); // All users
    expect(stack).toMatchSnapshot();
  }));

  it('createOrUpdate should query for stacks with same name', () => {
    const stack = { name: 'Notebook', type: 'jupyter' };

    return stacksRepository.createOrUpdate(project, user, stack)
      .then((createdStack) => {
        expect(mockDatabase().query()).toEqual({ name: createdStack.name });
        expect(mockDatabase().entity()).toEqual(createdStack);
        expect(mockDatabase().params()).toEqual({ upsert: true, setDefaultsOnInsert: true });
        expect(mockDatabase().project()).toBe('expectedProject');
        expect(mockDatabase().user()).toBe('username');
        expect(createdStack).toMatchSnapshot();
      });
  });

  it('deleteByName should query for stacks with same name', () => {
    const stack = { name: 'Stack', another: 'field' };

    return stacksRepository.deleteStack(project, user, stack)
      .then(() => {
        expect(mockDatabase().query()).toEqual({ name: stack.name });
        expect(mockDatabase().project()).toBe('expectedProject');
        expect(mockDatabase().user()).toBe('username');
      });
  });
});
