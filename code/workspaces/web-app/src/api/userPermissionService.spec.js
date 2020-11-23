import mockClient from './graphqlClient';
import userPermissionsService from './userPermissionsService';

jest.mock('./graphqlClient');

beforeEach(() => {
  mockClient.clearResult();
});

describe('userPermissionService', () => {
  describe('getUserPermissions', () => {
    it('should build correct query and unpack the result', () => {
      mockClient.prepareSuccess({ userPermissions: 'expectedValue' });

      return userPermissionsService.getUserPermissions().then((response) => {
        expect(response).toEqual('expectedValue');
        expect(mockClient.lastQuery()).toMatchSnapshot();
      });
    });

    it('should throw an error if the query fails', async () => {
      mockClient.prepareFailure('error');

      await expect(userPermissionsService.getUserPermissions()).rejects.toEqual({ error: 'error' });
    });
  });

  describe('getOtherUserRoles', () => {
    it('should build correct query and unpack the result', async () => {
      // Arrange
      const otherUserRoles = 'expectedValue';
      const userId = 'user-1234';
      mockClient.prepareSuccess({ otherUserRoles });

      // Act
      const userRoles = await userPermissionsService.getOtherUserRoles(userId);

      // Assert
      expect(userRoles).toEqual({ userId, otherUserRoles });
      expect(mockClient.lastQuery()).toMatchSnapshot();
    });

    it('should throw an error if the query fails', async () => {
      // Arrange
      const userId = 'user-1234';
      mockClient.prepareFailure('error');

      // Assert
      await expect(userPermissionsService.getOtherUserRoles(userId)).rejects.toEqual({ error: 'error' });
    });
  });
});
