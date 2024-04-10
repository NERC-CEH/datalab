import { permissionTypes } from 'common';
import database from '../config/database';
import databaseMock from './testUtil/databaseMock';
import userRoleRepository from './userRolesRepository';

const { INSTANCE_ADMIN_ROLE_KEY } = permissionTypes;

const user1 = {
  userId: 'uid1',
  userName: 'user1',
  instanceAdmin: false,
  dataManager: false,
  verified: true,
  projectRoles: [
    { projectKey: 'project 1', role: 'admin' },
    { projectKey: 'project 2', role: 'user' },
  ],
};

const user2 = {
  userId: 'uid2',
  userName: 'user2',
  instanceAdmin: true,
  dataManager: true,
  verified: true,
  catalogueRole: 'publisher',
  projectRoles: [
    { projectKey: 'project 2', role: 'viewer' },
  ],
};

const duplicateUser2 = {
  userId: 'uid2',
  userName: 'user2',
  verified: true,
  projectRoles: [
    { projectKey: 'project 3', role: 'admin' },
  ],
};

const userWithoutIdentity = {
  userId: 'uid?',
  projectRoles: [
    { projectKey: 'project 2', role: 'viewer' },
  ],
};

const testUserRoles = () => [user1, user2, duplicateUser2, userWithoutIdentity];

const unwrapUser = (user) => {
  const item = { ...user };
  delete item.toObject;
  return item;
};

let mockDatabase;
jest.mock('../config/database');

describe('userRolesRepository', () => {
  describe('helper functions', () => {
    it('combineRoles can combine roles', () => {
      expect(userRoleRepository.combineRoles(
        { userId: 'uid1', instanceAdmin: true, projectRoles: [{ projectKey: 'project1', role: 'viewer' }] },
        { userId: 'uid1', catalogueRole: 'admin', projectRoles: [{ projectKey: 'project2', role: 'admin' }] },
      )).toEqual(
        {
          userId: 'uid1',
          instanceAdmin: true,
          catalogueRole: 'admin',
          projectRoles: [
            { projectKey: 'project2', role: 'admin' },
            { projectKey: 'project1', role: 'viewer' },
          ],
        },
      );
    });
  });

  describe('read operations', () => {
    beforeEach(() => {
      mockDatabase = databaseMock(testUserRoles());
      database.getModel = mockDatabase;
      mockDatabase().clear();
    });

    it('getUser returns expected snapshot', async () => {
      mockDatabase().setFindOneReturn(user1);
      const user = await userRoleRepository.getUser('uid1');
      expect(mockDatabase().query()).toEqual({
        userId: 'uid1',
      });
      expect(user).toMatchSnapshot();
    });

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

    it('should add role to existing user if the user has no role on project', async () => {
      mockDatabase().setFindOneReturn(user1);
      const addRole = await userRoleRepository.addRole('uid1', 'project', 'admin');
      expect(addRole).toEqual(true);
      expect(mockDatabase()
        .query())
        .toEqual({
          userId: 'uid1',
        });

      expect(unwrapUser(mockDatabase().entity()))
        .toEqual({
          userId: 'uid1',
          userName: 'user1',
          instanceAdmin: false,
          dataManager: false,
          verified: true,
          projectRoles: [
            { projectKey: 'project 1', role: 'admin' },
            { projectKey: 'project 2', role: 'user' },
            { projectKey: 'project', role: 'admin' },
          ],
        });
    });

    it('should update role on existing user if the user has role on project', async () => {
      mockDatabase().setFindOneReturn(user1);
      const addRole = await userRoleRepository.addRole('uid1', 'project 2', 'admin');
      expect(addRole).toEqual(false);
      expect(mockDatabase().query()).toEqual({
        userId: 'uid1',
      });

      expect(unwrapUser(mockDatabase().entity())).toEqual({
        userId: 'uid1',
        userName: 'user1',
        instanceAdmin: false,
        dataManager: false,
        verified: true,
        projectRoles: [
          { projectKey: 'project 1', role: 'admin' },
          { projectKey: 'project 2', role: 'admin' },
        ],
      });
    });
  });

  describe('addRecordForNewUser', () => {
    beforeEach(() => {
      mockDatabase = databaseMock(testUserRoles());
      database.getModel = mockDatabase;
      mockDatabase().clear();
    });

    it('throws an error if the user already exists', async () => {
      await expect(userRoleRepository.addRecordForNewUser('uid1', 'user1')).rejects.toThrow(new Error('Creating new user for userId: uid1 user1, but they already exist'));
    });

    it('adds an empty record for a new user that does not exist', async () => {
      // Act
      const userRoles = await userRoleRepository.addRecordForNewUser('uid999', 'user999', true);

      // Assert
      expect(mockDatabase().invocation()).toEqual({
        // create a user
        query: { userName: 'user999' },
        entity: { $set: { userId: 'uid999', verified: true }, $setOnInsert: { projectRoles: [] } },
        params: { new: true, upsert: true },
      });
      expect(unwrapUser(userRoles)).toEqual({
        // created update
        userId: 'uid999',
        projectRoles: [],
        verified: true,
      });
    });

    it('adds an instanceAdmin record for a new user when none exist', async () => {
      // Arrange
      mockDatabase = databaseMock([]);
      database.getModel = mockDatabase;

      // Act
      const userRoles = await userRoleRepository.addRecordForNewUser('uid999', 'user999');

      // Assert
      expect(mockDatabase().invocation()).toEqual({
        // create a user
        query: { userName: 'user999' },
        entity: { $set: { userId: 'uid999', verified: true, instanceAdmin: true }, $setOnInsert: { projectRoles: [] } },
        params: { new: true, upsert: true },
      });
      expect(unwrapUser(userRoles)).toEqual({
        userId: 'uid999', verified: true, instanceAdmin: true, projectRoles: [],
      });
    });
  });

  describe('getRoles', () => {
    beforeEach(() => {
      mockDatabase = databaseMock(testUserRoles());
      database.getModel = mockDatabase;
      mockDatabase().clear();
    });

    it('returns expected user', async () => {
      // Arrange
      mockDatabase().setFindOneReturn(user1);

      // Act
      const userRoles = await userRoleRepository.getRoles('uid1');

      // Assert
      expect(mockDatabase().invocation()).toEqual({
        // look for user
        query: { userId: 'uid1' },
        entity: undefined,
        params: undefined,
      });
      expect(userRoles).toEqual({
        // add default roles
        catalogueRole: 'user',
        ...user1,
      });
    });

    it('adds an empty record for a user that does not have one when retrieving roles', async () => {
      // Act
      const userRoles = await userRoleRepository.getRoles('uid999', 'user999');

      // Assert
      expect(mockDatabase().invocation()).toEqual({
        // create a user
        query: { userName: 'user999' },
        entity: { $set: { userId: 'uid999', verified: true }, $setOnInsert: { projectRoles: [] } },
        params: { new: true, upsert: true },
      });
      expect(userRoles).toEqual({
        // add default roles
        userId: 'uid999',
        catalogueRole: 'user',
        instanceAdmin: false,
        dataManager: false,
        projectRoles: [],
        verified: true,
      });
    });

    it('creates an instanceAdmin for the first user', async () => {
      // Arrange
      mockDatabase = databaseMock([]);
      database.getModel = mockDatabase;

      // Act
      const userRoles = await userRoleRepository.getRoles('uid999', 'user999');

      // Assert
      expect(mockDatabase().invocation()).toEqual({
        // create a user
        query: { userName: 'user999' },
        entity: { $set: { userId: 'uid999', verified: true, instanceAdmin: true }, $setOnInsert: { projectRoles: [] } },
        params: { new: true, upsert: true },
      });
      expect(userRoles).toEqual({
        // add default roles
        userId: 'uid999',
        verified: true,
        catalogueRole: 'user',
        instanceAdmin: true,
        dataManager: false,
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
      mockDatabase().setFindOneReturn(user1);
      await userRoleRepository.removeRole('uid1', 'project 2');
      expect(unwrapUser(mockDatabase().entity())).toEqual({
        userId: 'uid1',
        userName: 'user1',
        instanceAdmin: false,
        dataManager: false,
        verified: true,
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

    it('update not called if user not found', async () => {
      const mockFn = jest.fn();
      mockDatabase().findOneAndUpdate = mockFn;
      await userRoleRepository.removeRole('not found', 'project 2');
      expect(mockFn).not.toBeCalled();
    });
  });

  describe('setSystemRole', () => {
    beforeEach(() => {
      mockDatabase = databaseMock(testUserRoles());
      database.getModel = mockDatabase;
      mockDatabase().clear();
    });

    it('should reject if the user is not in roles collection', async () => {
      mockDatabase = databaseMock([]);
      database.getModel = mockDatabase;
      await expect(userRoleRepository.setSystemRole('uid1', INSTANCE_ADMIN_ROLE_KEY, false)).rejects.toThrow('Unrecognised user uid1');
    });

    it('should set instanceAdmin', async () => {
      await userRoleRepository.setSystemRole('uid1', INSTANCE_ADMIN_ROLE_KEY, true);
      expect(mockDatabase().entity()[INSTANCE_ADMIN_ROLE_KEY]).toEqual(true);
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
      expect(mockDatabase().query()).toEqual({
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
