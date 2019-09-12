import { elementPermissions, projectPermissions, systemPermissions } from './permissionTypes';

describe('PermissionTypes', () => {
  it('generates expected permissions', () => expect(elementPermissions).toMatchSnapshot());

  it('generates expected permissions with the project prefix', () => expect(projectPermissions).toMatchSnapshot());

  it('generates expected system permissions', () => expect(systemPermissions).toMatchSnapshot());
});
