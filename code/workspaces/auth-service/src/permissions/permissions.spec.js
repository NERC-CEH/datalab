import getPermissions from './permissions';

describe('Get Permissions', () => {
  it('generated permissions should match snapshot', () => {
    const userRoles = {
      userId: 'uid1',
      instanceAdmin: true,
      projectRoles: [
        {
          projectKey: 'firstProjectName',
          role: 'admin',
        },
        {
          projectKey: 'secondProjectName',
          role: 'user',
        },
        {
          projectKey: 'thirdProjectName',
          role: 'viewer',
        },
      ],
    };

    const output = getPermissions(userRoles);
    expect(output).toMatchSnapshot();
  });

  it('should return empty permissions if all roles are unknown', () => {
    const userRoles = {
      userId: 'uid1',
      instanceAdmin: false,
      projectRoles: [
        {
          projectKey: 'missingRole',
        },
        {
          role: 'unknownRole',
        },
      ],
    };

    const output = getPermissions(userRoles);
    expect(output).toEqual([]);
  });

  it('should return permissions for known roles only', () => {
    const userRoles = {
      userId: 'uid1',
      instanceAdmin: false,
      projectRoles: [
        {
          projectKey: 'firstProjectName',
          role: 'viewer',
        },
        {
          projectKey: 'missingRole',
        },
      ],
    };

    const output = getPermissions(userRoles);
    expect(output).toMatchSnapshot();
  });
});
