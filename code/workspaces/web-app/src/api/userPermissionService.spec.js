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
});
