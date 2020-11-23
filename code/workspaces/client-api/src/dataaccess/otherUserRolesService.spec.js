import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import config from '../config';
import otherUserRolesService from './otherUserRolesService';

const mock = new MockAdapter(axios);

const authServiceUrl = `${config.get('authorisationService')}`;
const infraServiceUrl = `${config.get('infrastructureApi')}`;

const userId = 'user-1234';
const token = 'token';
const authRoles = {
  instanceAdmin: true,
  projectRoles: [
    { projectKey: 'proj-admin', role: 'admin' },
    { projectKey: 'proj-user', role: 'user' },
    { projectKey: 'proj-viewer', role: 'viewer' },
  ],
};
const infraRoles = {
  storageAccess: [{ projectKey: 'proj-storage', name: 'storageName' }],
  notebookOwner: [{ projectKey: 'proj-notebook', name: 'notebookName' }],
  siteOwner: [{ projectKey: 'proj-site', name: 'siteName' }],
};

describe('otherUserRolesService', () => {
  it('requests roles from auth and infrastructure service', async () => {
    // Arrange
    mock.onGet(`${authServiceUrl}/roles/${userId}`).reply(200, { userRoles: authRoles });
    mock.onGet(`${infraServiceUrl}/user-resources/${userId}`).reply(200, infraRoles);

    // Act
    const userRoles = await otherUserRolesService.getOtherUserRoles(userId, token);

    // Assert
    expect(userRoles).toEqual({
      instanceAdmin: true,
      projectAdmin: ['proj-admin'],
      projectUser: ['proj-user'],
      projectViewer: ['proj-viewer'],
      ...infraRoles,
    });
  });

  it('throws an error if request fails', () => {
    // Arrange
    mock.onGet(`${authServiceUrl}/roles/${userId}`).reply(403, { status: 'FORBIDDEN' });
    mock.onGet(`${infraServiceUrl}/user-resources/${userId}`).reply(403, { status: 'FORBIDDEN' });

    // Assert
    expect(otherUserRolesService.getOtherUserRoles(userId, token))
      .rejects.toEqual(new Error('Unable to get user roles for user-1234 Error: Request failed with status code 403'));
  });
});
