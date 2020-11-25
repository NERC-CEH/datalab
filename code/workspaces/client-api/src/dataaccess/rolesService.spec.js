import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import config from '../config';
import rolesService from './rolesService';

const mock = new MockAdapter(axios);

const authServiceUrl = `${config.get('authorisationService')}`;
const token = 'token';
const user1 = {
  userId: 'user-1',
  userName: 'user1@email.com',
  instanceAdmin: true,
  projectRoles: {
    projectKey: 'proj-1234',
    role: 'admin',
  },
};
const user2 = {
  userId: 'user-2',
  userName: 'user2@email.com',
  instanceAdmin: false,
  projectRoles: {
    projectKey: 'proj-5678',
    role: 'viewer',
  },
};

describe('getAllUsersAndRoles', () => {
  it('requests all users and roles from authservice', async () => {
    // Arrange
    mock.onGet(`${authServiceUrl}/roles`).reply(200, [user1, user2]);

    // Act
    const userRoles = await rolesService.getAllUsersAndRoles(token);

    // Assert
    expect(userRoles).toEqual([
      { name: 'user1@email.com', ...user1 },
      { name: 'user2@email.com', ...user2 },
    ]);
  });

  it('throws an error if request fails', async () => {
    // Arrange
    mock.onGet(`${authServiceUrl}/roles`).reply(403, { status: 'FORBIDDEN' });

    // Assert
    await expect(rolesService.getAllUsersAndRoles(token))
      .rejects.toEqual(new Error('Unable to get all users and roles Error: Request failed with status code 403'));
  });
});
