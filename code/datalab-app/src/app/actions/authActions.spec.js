import authActions, {
  USER_LOGIN_ACTION,
  GET_USER_PERMISSIONS_ACTION,
} from './authActions';
import * as userPermissionService from '../api/userPermissionsService';

jest.mock('../api/userPermissionsService');

describe('authActions', () => {
  beforeEach(() => jest.resetAllMocks());

  describe('calls correct service for', () => {
    it('userLogsIn', () => {
      // Arrange
      const user = 'expectedUser';

      // Act
      const output = authActions.userLogsIn(user);

      // Assert
      expect(output.type).toBe('USER_LOGIN_ACTION');
      expect(output.payload).toBe(user);
    });

    it('getUserPermissions', () => {
      // Arrange
      const serviceMock = jest.fn().mockReturnValue('expectedPermissions');
      userPermissionService.default = serviceMock;

      // Act
      expect(serviceMock).not.toHaveBeenCalled();
      const output = authActions.getUserPermissions();

      // Assert
      expect(serviceMock).toHaveBeenCalledTimes(1);
      expect(output.type).toBe('GET_USER_PERMISSIONS_ACTION');
      expect(output.payload).toBe('expectedPermissions');
    });
  });

  describe('exports correct values for', () => {
    it('USER_LOGIN', () => {
      expect(USER_LOGIN_ACTION).toBe('USER_LOGIN_ACTION');
    });

    it('GET_USER_PERMISSIONS', () => {
      expect(GET_USER_PERMISSIONS_ACTION).toBe('GET_USER_PERMISSIONS_ACTION');
    });
  });
});
