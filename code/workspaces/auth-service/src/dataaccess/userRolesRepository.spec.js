import getRoles from './userRolesRepository';
import database from '../config/database';
import databaseMock from './testUtil/databaseMock';

const wrapDocument = document => ({
  ...document,
  toObject: () => document,
});

const testUserRoles = [
  {
    userId: 'uid1',
    instanceAdmin: false,
    projectRoles: [
      {
        projectName: 'project 1',
        role: 'admin',
      },
      {
        projectName: 'project 2',
        role: 'user',
      },
    ],
  },
  {
    userId: 'uid2',
    instanceAdmin: true,
    projectRoles: [
      {
        projectName: 'project 2',
        role: 'viewer',
      },
    ],
  },
];
const mockDatabase = databaseMock(testUserRoles.map(wrapDocument));
jest.mock('../config/database');
database.getModel = mockDatabase;

describe('userRolesRepository', () => {
  beforeEach(() => {
    mockDatabase().clear();
  });

  it('getRoles returns expected snapshot', () => getRoles('uid1')
    .then((userRoles) => {
      expect(mockDatabase().query()).toEqual({
        userId: 'uid1',
      });
      expect(userRoles).toMatchSnapshot();
    }));
});
