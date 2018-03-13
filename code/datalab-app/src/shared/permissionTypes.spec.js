import { elementPermissions, projectPermissions } from './permissionTypes';

describe('PermissionTypes', () => {
  it('generates expected permissions', () =>
    expect(elementPermissions).toMatchSnapshot());

  it('generates expected permisisons with the project prefix', () =>
    expect(projectPermissions).toMatchSnapshot());
});
