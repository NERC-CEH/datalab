import { ANALYSIS, PUBLISH } from 'common/src/stackTypes';
import createUserRoles from './createUserRoles';

describe('createUserRoles', () => {
  it('returns empty object if resources still fetching', () => {
    // Arrange
    const fetching = true;
    const value = [];
    const usersProjectRoles = { fetching, value };
    const stacksArray = { fetching, value };
    const dataStorageArray = { fetching, value };

    // Act
    const userRoles = createUserRoles(usersProjectRoles, stacksArray, dataStorageArray);

    // Assert
    expect(userRoles).toEqual({});
  });

  it('create user roles from project roles and resources', () => {
    // Arrange
    const fetching = false;
    const userId = 'user-1234';
    const projectKey = 'proj-1234';
    const usersProjectRoles = {
      fetching,
      value: [
        {
          userId,
          name: 'user name',
          instanceAdmin: true,
          catalogueRole: 'admin',
          projectRoles: [{
            projectKey,
            role: 'admin',
          }],
        },
      ],
    };
    const stacksArray = {
      fetching,
      value: [
        {
          projectKey,
          category: ANALYSIS,
          name: 'notebook name',
          users: [userId],
        },
        {
          projectKey,
          category: PUBLISH,
          name: 'site name',
          users: [userId],
        },
      ],
    };
    const dataStorageArray = {
      fetching,
      value: [
        {
          projectKey,
          name: 'storage name',
          users: [userId],
        },
      ],
    };

    // Act
    const userRoles = createUserRoles(usersProjectRoles, stacksArray, dataStorageArray);

    // Assert
    expect(userRoles).toEqual({
      'user-1234': {
        instanceAdmin: true,
        catalogueRole: 'admin',
        catalogueAdmin: true,
        cataloguePublisher: false,
        catalogueEditor: false,
        projectAdmin: [projectKey],
        projectUser: [],
        projectViewer: [],
        siteOwner: [{ projectKey, name: 'site name' }],
        notebookOwner: [{ projectKey, name: 'notebook name' }],
        storageAccess: [{ projectKey, name: 'storage name' }],
      },
    });
  });
});
