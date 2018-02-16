import getPermissions from './permissions';

describe('Get Permissions', () => {
  it('generated permissions should match snapshot', () => {
    const roles = [
      'instance-admin',
      'firstProjectName:admin',
      'secondProjectName:user',
      'thirdProjectName:viewer',
    ];

    const output = getPermissions(roles);
    expect(output).toMatchSnapshot();
  });

  it('should return empty permissions if all roles are unknown', () => {
    const roles = ['unknownRole', 'missingRole'];

    const output = getPermissions(roles);
    expect(output).toEqual([]);
  });

  it('should return permissions for known roles only', () => {
    const roles = ['firstProjectName:viewer', 'missingRole'];

    const output = getPermissions(roles);
    expect(output).toMatchSnapshot();
  });
});
