import mockClient from './graphqlClient';
import rolesService from './rolesService';

jest.mock('./graphqlClient');

describe('rolesService', () => {
  beforeEach(() => mockClient.clearResult());

  describe('getAllUsersAndRoles', () => {
    it('should build the correct query and unpack the results', () => {
      mockClient.prepareSuccess({ allUsersAndRoles: 'expectedValue' });

      return rolesService.getAllUsersAndRoles().then((response) => {
        expect(response).toEqual('expectedValue');
        expect(mockClient.lastQuery()).toMatchSnapshot();
      });
    });

    it('should throw an error if the query fails', () => {
      mockClient.prepareFailure('error');

      return rolesService.getAllUsersAndRoles().catch((error) => {
        expect(error).toEqual({ error: 'error' });
      });
    });
  });
});
