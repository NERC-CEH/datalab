import { elementPermissions, projectPermissions, systemPermissions, PROJECT_ROLES, CATALOGUE_ROLES } from './permissionTypes';

describe('PermissionTypes', () => {
  it('generates expected permissions', () => expect(elementPermissions).toMatchSnapshot());

  it('generates expected permissions with the project prefix', () => expect(projectPermissions).toMatchSnapshot());

  it('generates expected system permissions', () => expect(systemPermissions).toMatchSnapshot());

  it('has expected project roles', () => expect(PROJECT_ROLES).toEqual(['admin', 'user', 'viewer']));

  it('has expected catalogue roles', () => expect(CATALOGUE_ROLES).toEqual(['admin', 'publisher', 'editor', 'user']));
});
