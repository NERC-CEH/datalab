import stacksRepository from './stacksRepository';
import database from '../config/database';
import databaseMock from './testUtil/databaseMock';

jest.mock('../config/database');

const project = 'expectedProject';
const user = {
  sub: 'username',
  roles: {
    instanceAdmin: false,
    projectRoles: [
      { projectKey: project, role: 'admin' },
      { projectKey: 'viewerOnlyProject', role: 'admin' },
    ],
  },
};
const testStacks = [
  { name: 'Stack 1', users: [user.sub] },
  { name: 'Stack 2' },
];

const mockDatabase = databaseMock(testStacks);

describe('stacksRepository', () => {
  beforeEach(() => {
    mockDatabase().clear();
    database.getModel = mockDatabase;
  });

  it('getAllByUser returns expected snapshot', () => stacksRepository.getAllByUser(user).then((stacks) => {
    expect(mockDatabase().user()).toBe('username');
    expect(stacks).toMatchSnapshot();
  }));

  it('getAllStacks returns expected snapshot', () => stacksRepository.getAllStacks(user).then((stacks) => {
    expect(stacks).toMatchSnapshot();
  }));

  it('getAllOwned uses expected query', async () => {
    await stacksRepository.getAllOwned(user);
    expect(mockDatabase().user()).toBe('username');
  });

  it('getAllByCategory returns expected snapshot', () => stacksRepository.getAllByCategory(project, user, 'expectedCategory').then((stacks) => {
    expect(mockDatabase().category()).toBe('expectedCategory');
    expect(mockDatabase().project()).toBe('expectedProject');
    expect(mockDatabase().user()).toBe('username');
    expect(stacks).toMatchSnapshot();
  }));

  it('getAllByVolumeMount returns expected snapshot', () => stacksRepository.getAllByVolumeMount(project, user, 'expectedVolume').then((stacks) => {
    expect(mockDatabase().isLean()).toBeFalsy();
    expect(mockDatabase().query()).toEqual({ volumeMount: 'expectedVolume' });
    expect(mockDatabase().project()).toBe('expectedProject');
    expect(mockDatabase().user()).toBe(undefined); // All users
    expect(stacks).toMatchSnapshot();
  }));

  it('getAllByVolumeMountAnonymised returns expected snapshot', () => stacksRepository.getAllByVolumeMountAnonymised(project, user, 'expectedVolume').then((stacks) => {
    expect(mockDatabase().isLean()).toBeTruthy();
    expect(mockDatabase().query()).toEqual({ volumeMount: 'expectedVolume' });
    expect(mockDatabase().project()).toBe('expectedProject');
    expect(mockDatabase().user()).toBe(undefined); // All users
    expect(stacks).toMatchSnapshot();
  }));

  it('getAllByAsset returns expected snapshot', () => stacksRepository.getAllByAsset('asset-id').then((stacks) => {
    expect(mockDatabase().query()).toEqual({ assetIds: { $elemMatch: { $eq: 'asset-id' } } });
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

  it('userCanRestartStack only if listed user or instance admin', async () => {
    expect(await stacksRepository.userCanRestartStack(project, { sub: 'username' }, 'Stack 1')).toEqual(true);
    expect(await stacksRepository.userCanRestartStack(project, { sub: 'someone-else' }, 'Stack 1')).toEqual(false);
    expect(await stacksRepository.userCanRestartStack(project, { sub: 'someone-else', roles: { instanceAdmin: true } }, 'Stack 1')).toEqual(true);
  });

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

  it('updateAssets should update stack assets', async () => {
    await stacksRepository.updateAssets('id', ['asset-id']);
    expect(mockDatabase().queries()).toContainEqual({ _id: 'id' });
    expect(mockDatabase().entity()).toEqual({ assetIds: ['asset-id'] });
  });

  describe('update', () => {
    it('should query for stacks of the same name', async () => {
      const name = 'stack';
      const updatedValues = { displayName: 'Display Name' };

      await stacksRepository.update(project, user, name, updatedValues);
      expect(mockDatabase().queries()).toContainEqual({ name });
      expect(mockDatabase().project()).toBe('expectedProject');
      expect(mockDatabase().user()).toBe('username');
      expect(mockDatabase().entity()).toEqual(updatedValues);
    });

    it('should update visible status if shared is changed', async () => {
      const name = 'stack';
      const updatedValues = { displayName: 'Display Name', shared: 'private' };
      const expectedUpdatedValues = { displayName: 'Display Name', shared: 'private', visible: 'private' };

      await stacksRepository.update(project, user, name, updatedValues);
      expect(mockDatabase().queries()).toContainEqual({ name });
      expect(mockDatabase().project()).toBe('expectedProject');
      expect(mockDatabase().user()).toBe('username');
      expect(mockDatabase().entity()).toEqual(expectedUpdatedValues);
    });
  });
});

const stacksWithViewableProject = [
  { name: 'Stack 1', users: [user.sub] },
  { name: 'Stack 2', users: [user.sub], projectKey: 'viewerOnlyProject', category: 'ANALYSIS' },
  { name: 'Stack 3', users: [user.sub], projectKey: 'viewerOnlyProject', category: 'PUBLISH' },
];

const viewer = {
  sub: 'username',
  roles: {
    instanceAdmin: false,
    projectRoles: [
      { projectKey: 'viewerOnlyProject', role: 'viewer' },
    ],
  },
};

describe('stacksRepository as viewer', () => {
  beforeEach(() => {
    const mockDatabaseWithViewableProject = databaseMock(stacksWithViewableProject);
    database.getModel = mockDatabaseWithViewableProject;
  });

  it('getAllByUser filters analysis stacks the user is a viewer for', async () => {
    const stacksAsAdmin = await stacksRepository.getAllByUser(user);
    expect(stacksAsAdmin).toHaveLength(3);

    const stacksAsViewer = await stacksRepository.getAllByUser(viewer);
    expect(stacksAsViewer).toHaveLength(2);
    expect(stacksAsViewer[0].name).toEqual('Stack 1');
    expect(stacksAsViewer[1].name).toEqual('Stack 3');
  });

  it('getAllOwned filters analysis stacks the user is a viewer for', async () => {
    const stacksAsAdmin = await stacksRepository.getAllOwned(user);
    expect(stacksAsAdmin).toHaveLength(3);

    const stacksAsViewer = await stacksRepository.getAllOwned(viewer);
    expect(stacksAsViewer).toHaveLength(2);
    expect(stacksAsViewer[0].name).toEqual('Stack 1');
    expect(stacksAsViewer[1].name).toEqual('Stack 3');
  });

  it('getAllByProject filters analysis stacks the user is a viewer for', async () => {
    database.getModel = databaseMock(stacksWithViewableProject.filter(s => s.projectKey === 'viewerOnlyProject'));

    const stacksAsAdmin = await stacksRepository.getAllByProject('viewerOnlyProject', user);
    expect(stacksAsAdmin).toHaveLength(2);

    const stacksAsViewer = await stacksRepository.getAllByProject('viewerOnlyProject', viewer);
    expect(stacksAsViewer).toHaveLength(1);
    expect(stacksAsViewer[0].name).toEqual('Stack 3');
  });

  it('getAllByCategory filters analysis stacks the user is a viewer for', async () => {
    database.getModel = databaseMock(stacksWithViewableProject.filter(s => s.projectKey === 'viewerOnlyProject' && s.category === 'ANALYSIS'));

    const stacksAsAdmin = await stacksRepository.getAllByCategory('viewerOnlyProject', user, 'ANALYSIS');
    expect(stacksAsAdmin).toHaveLength(1);

    const stacksAsViewer = await stacksRepository.getAllByCategory('viewerOnlyProject', viewer, 'ANALYSIS');
    expect(stacksAsViewer).toHaveLength(0);
  });
});

describe('anonymiseStack', () => {
  const userId = 'userId';

  it('returns the original stack if it is not private', () => {
    const stack = {
      name: 'stack',
      displayName: 'Public name',
      description: 'Public description',
      shared: 'public',
      visible: 'public',
      users: ['otherUser'],
      url: 'url.com',
    };

    const response = stacksRepository.anonymiseStack(userId)(stack);
    expect(response).toEqual(stack);
  });

  it('returns the original stack if the current user is the owner', () => {
    const stack = {
      name: 'stack',
      displayName: 'Public name',
      description: 'Public description',
      shared: 'private',
      visible: 'private',
      users: [userId],
      url: 'url.com',
    };

    const response = stacksRepository.anonymiseStack(userId)(stack);
    expect(response).toEqual(stack);
  });

  it('returns an anonymised stack if the current user is not the owner', () => {
    const stack = {
      name: 'stack',
      displayName: 'Secret name',
      description: 'Secret description',
      shared: 'private',
      visible: 'private',
      users: ['otherUser'],
      url: 'url.com',
    };

    const expected = {
      name: 'private',
      displayName: 'Private',
      description: 'Private',
      shared: 'private',
      visible: 'private',
      users: ['otherUser'],
      url: null,
    };

    const response = stacksRepository.anonymiseStack(userId)(stack);
    expect(response).toEqual(expected);
  });
});
