import getPermissions from './permissions';

describe('Get Permissions', () => {
  it('generated permissions should match snapshot', () => {
    const userRoles = {
      userId: 'uid1',
      instanceAdmin: true,
      projectRoles: [
        {
          projectKey: 'firstProjectKey',
          role: 'admin',
        },
        {
          projectKey: 'secondProjectKey',
          role: 'user',
        },
        {
          projectKey: 'thirdProjectKey',
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
          projectKey: 'firstProjectKey',
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

  it('should add instance admin permission', () => {
    const userRole = {
      userId: 'uid1',
      instanceAdmin: true,
    };

    const output = getPermissions(userRole);
    expect(output).toEqual(['system:instance:admin']);
  });

  it('should add catalogue admin permissions', () => {
    const userRole = {
      userId: 'uid1',
      catalogueRole: 'admin',
    };

    const output = getPermissions(userRole);
    expect(output).toEqual(['system:catalogue:admin']);
  });

  it('should add catalogue publisher permission', () => {
    const userRole = {
      userId: 'uid1',
      catalogueRole: 'publisher',
    };

    const output = getPermissions(userRole);
    expect(output).toEqual(['system:catalogue:publish']);
  });

  it('should add catalogue editor permission', () => {
    const userRole = {
      userId: 'uid1',
      catalogueRole: 'editor',
    };

    const output = getPermissions(userRole);
    expect(output).toEqual(['system:catalogue:edit']);
  });
});
