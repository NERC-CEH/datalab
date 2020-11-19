import otherUserRolesActions, {
  GET_OTHER_USER_ROLES_ACTION,
} from './otherUserRolesActions';
import permissionsService from '../api/userPermissionsService';

jest.mock('../api/userPermissionsService');

describe('otherUserRolesActions', () => {
  describe('calls correct service for', () => {
    it('getOtherUserRoles', () => {
      // Arrange
      const getOtherUserRolesMock = jest.fn().mockReturnValue('expectedRolesPayload');
      permissionsService.getOtherUserRoles = getOtherUserRolesMock;

      // Act
      const output = otherUserRolesActions.getOtherUserRoles();

      // Assert
      expect(getOtherUserRolesMock).toHaveBeenCalledTimes(1);
      expect(output.type).toBe(GET_OTHER_USER_ROLES_ACTION);
      expect(output.payload).toBe('expectedRolesPayload');
    });
  });

  describe('exports correct values for', () => {
    it('GET_OTHER_USER_ROLES_ACTION', () => {
      expect(GET_OTHER_USER_ROLES_ACTION).toBe('GET_OTHER_USER_ROLES_ACTION');
    });
  });
});
