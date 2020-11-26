import roleActions, {
  GET_ALL_USERS_AND_ROLES_ACTION,
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
  });

  describe('exports correct values for', () => {
    it('GET_ALL_USERS_AND_ROLES_ACTION', () => {
      expect(GET_ALL_USERS_AND_ROLES_ACTION).toBe('GET_ALL_USERS_AND_ROLES_ACTION');
    });
  });
});
