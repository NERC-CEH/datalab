import userRoleRepository from './userRolesRepository';
import database from '../config/database';
import databaseMock from './testUtil/databaseMock';

const wrapDocument = document => ({
  ...document,
  toObject: () => document,
});

const testUserRoles = () => [
  {
    userId: 'uid1',
    instanceAdmin: false,
    projectRoles: [
      { projectName: 'project 1', role: 'admin' },
      { projectName: 'project 2', role: 'user' },
    ],
  },
  {
    userId: 'uid2',
    instanceAdmin: true,
    projectRoles: [
      { projectName: 'project 2', role: 'viewer' },
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

    it('getProjectUsers returns expected snapshot', () => userRoleRepository.getProjectUsers('project 2')
      .then((users) => {
        expect(mockDatabase().query()).toEqual({
          'projectRoles.projectName': { $eq: 'project 2' },
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

    it('should create a new user if the user is not in roles collection', async () => {
      mockDatabase = databaseMock([]);
      database.getModel = mockDatabase;
      await userRoleRepository.addRole('uid1', 'project', 'admin');
      expect(mockDatabase().query()).toEqual({
        userId: 'uid1',
      });

      expect(mockDatabase().invocation()).toEqual({
        query: { userId: 'uid1' },
        entity: { userId: 'uid1', projectRoles: [{ projectName: 'project', role: 'admin' }] },
        params: { upsert: true, setDefaultsOnInsert: true, runValidators: true },
      });
    });

    it('should add role to existing user if the user has no role on project', async () => {
      await userRoleRepository.addRole('uid1', 'project', 'admin');
      expect(mockDatabase()
        .query())
        .toEqual({
          userId: 'uid1',
        });

      expect(mockDatabase()
        .invocation().entity)
        .toEqual({
          userId: 'uid1',
          instanceAdmin: false,
          projectRoles: [
            { projectName: 'project 1', role: 'admin' },
            { projectName: 'project 2', role: 'user' },
            { projectName: 'project', role: 'admin' },
          ],
        });
    });

    it('should update role on existing user if the user has role on project', async () => {
      await userRoleRepository.addRole('uid1', 'project 2', 'admin');
      expect(mockDatabase().query()).toEqual({
        userId: 'uid1',
      });

      expect(mockDatabase().invocation().entity).toEqual({
        userId: 'uid1',
        instanceAdmin: false,
        projectRoles: [
          { projectName: 'project 1', role: 'admin' },
          { projectName: 'project 2', role: 'admin' },
        ],
      });
    });
  });
});
