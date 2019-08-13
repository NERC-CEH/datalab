import mockClient from './graphqlClient';
import getUserPermissions from './userPermissionsService';

jest.mock('./graphqlClient');

describe('userPermissionService', () => {
  beforeEach(() => {
    mockClient.clearResult();
  });

  it('getUserPermissions should build correct query and unpack the result', () => {
    mockClient.prepareSuccess({ userPermissions: 'expectedValue' });

    return getUserPermissions().then((response) => {
      expect(response).toEqual('expectedValue');
      expect(mockClient.lastQuery()).toMatchSnapshot();
    });
  });

  it('getUserPermissions should throw an error if the query fails', () => {
    mockClient.prepareFailure('error');

    return getUserPermissions().catch((error) => {
      expect(error).toEqual({ error: 'error' });
    });
  });
});
