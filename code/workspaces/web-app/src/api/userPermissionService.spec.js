import mockClient from './graphqlClient';
import userPermissionsService from './userPermissionsService';

jest.mock('./graphqlClient');

describe('userPermissionService', () => {
  beforeEach(() => {
    mockClient.clearResult();
  });

  it('getUserPermissions should build correct query and unpack the result', () => {
    mockClient.prepareSuccess({ userPermissions: 'expectedValue' });

    return userPermissionsService.getUserPermissions().then((response) => {
      expect(response).toEqual('expectedValue');
      expect(mockClient.lastQuery()).toMatchSnapshot();
    });
  });

  it('getUserPermissions should throw an error if the query fails', () => {
    mockClient.prepareFailure('error');

    return userPermissionsService.getUserPermissions().catch((error) => {
      expect(error).toEqual({ error: 'error' });
    });
  });
});
