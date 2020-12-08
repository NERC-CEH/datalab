import userRoleRepository from './userRolesRepository';
import database from '../config/database';
import databaseMock from './testUtil/databaseMock';

const wrapDocument = document => ({
  ...document,
  toObject: () => document,
});

const unwrapDocument = (document) => {
  const newDoc = { ...document };
  delete newDoc.toObject;
  return newDoc;
};

const testUserRoles = () => [
  {
    userId: 'uid1',
    userName: 'user1',
    instanceAdmin: false,
    projectRoles: [
      { projectKey: 'project 1', role: 'admin' },
      { projectKey: 'project 2', role: 'user' },
    ],
  },
  {
    userId: 'uid2',
    userName: 'user2',
    instanceAdmin: true,
    catalogueRole: 'publisher',
    projectRoles: [
      { projectKey: 'project 2', role: 'viewer' },
    ],
  },
  {
    // duplicate user
    userId: 'uid2',
    userName: 'user2',
    projectRoles: [
      { projectKey: 'project 2', role: 'viewer' },
    ],
  },
  {
    // user without identity
    userId: 'uid?',
    projectRoles: [
      { projectKey: 'project 2', role: 'viewer' },
    ],
  },
];

let mockDatabase;
jest.mock('../config/database');

describe('userRolesRepository', () => {
  describe('read operations', () => {
    beforeEach(() => {
      mockDatabase = databaseMock(testUserRoles().map(wrapDocument));
      database.getModel = mockDatabase;
      mockDatabase().clear();
    });

    it('getRoles returns expected snapshot', () => userRoleRepository.getRoles('uid1')
      .then((userRoles) => {
        expect(mockDatabase().query()).toEqual({
          userId: 'uid1',
        });
        expect(userRoles).toMatchSnapshot();
      }));

    it('getUser returns expected snapshot', () => userRoleRepository.getUser('uid1')
      .then((user) => {
        expect(mockDatabase().query()).toEqual({
          userId: 'uid1',
        });
        expect(user).toMatchSnapshot();
      }));

    it('getUsers returns expected snapshot', () => userRoleRepository.getUsers()
      .then((users) => {
        expect(mockDatabase().query()).toEqual();
        expect(users).toMatchSnapshot();
      }));

    it('getAllUsersAndRoles returns expected snapshot', () => userRoleRepository.getAllUsersAndRoles()
      .then((usersAndRoles) => {
        expect(mockDatabase().query()).toEqual();
        expect(usersAndRoles).toMatchSnapshot();
      }));

    it('getProjectUsers returns expected snapshot', () => userRoleRepository.getProjectUsers('project 2')
      .then((users) => {
        expect(mockDatabase().query()).toEqual({
          'projectRoles.projectKey': { $eq: 'project 2' },
        });
        expect(users).toMatchSnapshot();
      }));
  });

  describe('add role', () => {
    beforeEach(() => {
      mockDatabase = databaseMock(testUserRoles());
      database.getModel = mockDatabase;
      mockDatabase().clear();
    });

    it('should reject if the user is not in roles collection', async () => {
      mockDatabase = databaseMock([]);
      database.getModel = mockDatabase;
      await expect(userRoleRepository.addRole('uid1', 'project', 'admin')).rejects.toThrow('Unrecognised user uid1');
    });

    it('should add role to existing user if the user has no role on project', async () => {
      const addRole = await userRoleRepository.addRole('uid1', 'project', 'admin');
      expect(addRole).toEqual(true);
      expect(mockDatabase()
        .query())
        .toEqual({
          userId: 'uid1',
        });

      expect(mockDatabase()
        .invocation().entity)
        .toEqual({
          userId: 'uid1',
          userName: 'user1',
          instanceAdmin: false,
          projectRoles: [
            { projectKey: 'project 1', role: 'admin' },
            { projectKey: 'project 2', role: 'user' },
            { projectKey: 'project', role: 'admin' },
          ],
        });
    });

    it('should update role on existing user if the user has role on project', async () => {
      const addRole = await userRoleRepository.addRole('uid1', 'project 2', 'admin');
      expect(addRole).toEqual(false);
      expect(mockDatabase().query()).toEqual({
        userId: 'uid1',
      });

      expect(mockDatabase().invocation().entity).toEqual({
        userId: 'uid1',
        userName: 'user1',
        instanceAdmin: false,
        projectRoles: [
          { projectKey: 'project 1', role: 'admin' },
          { projectKey: 'project 2', role: 'admin' },
        ],
      });
    });

    it('should add an empty record for a user that does not have one when retrieving roles', async () => {
      mockDatabase = databaseMock([]);
      database.getModel = mockDatabase;
      await userRoleRepository.getRoles('uid999', 'user999');

      expect(mockDatabase().invocation().entity).toEqual({
        userId: 'uid999',
        userName: 'user999',
        projectRoles: [],
      });
    });
  });

  describe('delete role', () => {
    beforeEach(() => {
      mockDatabase = databaseMock(testUserRoles());
      database.getModel = mockDatabase;
      mockDatabase().clear();
    });

    it('should delete role from user', async () => {
      await userRoleRepository.removeRole('uid1', 'project 2');
      expect(mockDatabase().invocation().entity).toEqual({
        userId: 'uid1',
        userName: 'user1',
        instanceAdmin: false,
        projectRoles: [
          { projectKey: 'project 1', role: 'admin' },
        ],
      });
    });

    it('update not called if user does not have role on project', async () => {
      const mockFn = jest.fn();
      mockDatabase().findOneAndUpdate = mockFn;
      await userRoleRepository.removeRole('uid1', 'not found');
      expect(mockFn).not.toBeCalled();
    });

    it('update note called if user not found', async () => {
      const mockFn = jest.fn();
      mockDatabase().findOneAndUpdate = mockFn;
      await userRoleRepository.removeRole('not found', 'project 2');
      expect(mockFn).not.toBeCalled();
    });
  });

  describe('setInstanceAdmin', () => {
    beforeEach(() => {
      mockDatabase = databaseMock(testUserRoles().map(wrapDocument));
      database.getModel = mockDatabase;
      mockDatabase().clear();
    });

    it('should reject if the user is not in roles collection', async () => {
      mockDatabase = databaseMock([]);
      database.getModel = mockDatabase;
      await expect(userRoleRepository.setInstanceAdmin('uid1', false)).rejects.toThrow('Unrecognised user uid1');
    });

    it('should set instanceAdmin', async () => {
      await userRoleRepository.setInstanceAdmin('uid1', true);
      expect(unwrapDocument(mockDatabase().invocation().entity).instanceAdmin).toEqual(true);
    });
  });

  describe('setCatalogueRole', () => {
    beforeEach(() => {
      mockDatabase = databaseMock(testUserRoles().map(wrapDocument));
      database.getModel = mockDatabase;
      mockDatabase().clear();
    });

    it('should reject if the user is not in roles collection', async () => {
      mockDatabase = databaseMock([]);
      database.getModel = mockDatabase;
      await expect(userRoleRepository.setCatalogueRole('uid1', 'user')).rejects.toThrow('Unrecognised user uid1');
    });

    it('should set catalogueRole', async () => {
      await userRoleRepository.setCatalogueRole('uid1', 'user');
      expect(unwrapDocument(mockDatabase().invocation().entity).catalogueRole).toEqual('user');
    });
  });

  describe('user is member', () => {
    beforeEach(() => {
      mockDatabase = databaseMock(testUserRoles());
      database.getModel = mockDatabase;
      mockDatabase().clear();
    });

    it('should query the database with expected arguments', async () => {
      await userRoleRepository.userIsMember('user_id', 'projectKey');
      expect(mockDatabase().invocation().query).toEqual({
        'projectRoles.projectKey': {
          $eq: 'projectKey',
        },
        userId: {
          $eq: 'user_id',
        },
      });
    });

    it('should return boolean value given by exists method', async () => {
      const output = await userRoleRepository.userIsMember('user_id', 'projectKey');
      expect(output).toBe(true);
    });
  });
});
