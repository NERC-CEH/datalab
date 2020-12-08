import roleActions, {
  GET_ALL_USERS_AND_ROLES_ACTION, SET_INSTANCE_ADMIN_ACTION, SET_CATALOGUE_ROLE_ACTION,
} from './roleActions';
import rolesService from '../api/rolesService';

jest.mock('../api/rolesService');

describe('roleActions', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('calls correct service for', () => {
    it('getAllUsersAndRoles', () => {
      // Arrange
      const getAllUsersAndRolesMock = jest.fn().mockReturnValue('expectedUsersAndRolesPayload');
      rolesService.getAllUsersAndRoles = getAllUsersAndRolesMock;

      // Act
      const output = roleActions.getAllUsersAndRoles();

      // Assert
      expect(getAllUsersAndRolesMock).toHaveBeenCalledTimes(1);
      expect(output.type).toBe(GET_ALL_USERS_AND_ROLES_ACTION);
      expect(output.payload).toBe('expectedUsersAndRolesPayload');
    });

    it('setInstanceAdmin', () => {
      // Arrange
      const setInstanceAdminMock = jest.fn().mockReturnValue('expectedSetInstanceAdminPayload');
      rolesService.setInstanceAdmin = setInstanceAdminMock;

      // Act
      const output = roleActions.setInstanceAdmin('one', false);

      // Assert
      expect(setInstanceAdminMock).toHaveBeenCalledWith('one', false);
      expect(output.type).toBe(SET_INSTANCE_ADMIN_ACTION);
      expect(output.payload).toBe('expectedSetInstanceAdminPayload');
    });

    it('setCatalogueRole', () => {
      // Arrange
      const setCatalogueRoleMock = jest.fn().mockReturnValue('expectedSetCatalogueRolePayload');
      rolesService.setCatalogueRole = setCatalogueRoleMock;

      // Act
      const output = roleActions.setCatalogueRole('one', 'publisher');

      // Assert
      expect(setCatalogueRoleMock).toHaveBeenCalledWith('one', 'publisher');
      expect(output.type).toBe(SET_CATALOGUE_ROLE_ACTION);
      expect(output.payload).toBe('expectedSetCatalogueRolePayload');
    });
  });

  describe('exports correct values for', () => {
    it('GET_ALL_USERS_AND_ROLES_ACTION', () => {
      expect(GET_ALL_USERS_AND_ROLES_ACTION).toBe('GET_ALL_USERS_AND_ROLES_ACTION');
    });
    it('SET_INSTANCE_ADMIN_ACTION', () => {
      expect(SET_INSTANCE_ADMIN_ACTION).toBe('SET_INSTANCE_ADMIN_ACTION');
    });
    it('SET_CATALOGUE_ROLE_ACTION', () => {
      expect(SET_CATALOGUE_ROLE_ACTION).toBe('SET_CATALOGUE_ROLE_ACTION');
    });
  });
});
