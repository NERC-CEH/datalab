import { elementPermissions, projectPermissions } from './permissionTypes';

describe('PermissionTypes', () => {
  it('generates expected permissions', () => expect(elementPermissions).toMatchSnapshot());

  it('generates expected permissions with the project prefix', () => expect(projectPermissions).toMatchSnapshot());
});
