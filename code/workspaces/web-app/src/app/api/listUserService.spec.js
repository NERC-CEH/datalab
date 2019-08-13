import mockClient from './graphqlClient';
import listUserService from './listUsersService';

jest.mock('./graphqlClient');

describe('listUserService', () => {
  beforeEach(() => mockClient.clearResult());

  describe('listUsers', () => {
    it('should build the correct query and unpack the results', () => {
      mockClient.prepareSuccess({ users: 'expectedValue' });

      return listUserService.listUsers().then((response) => {
        expect(response).toEqual('expectedValue');
        expect(mockClient.lastQuery()).toMatchSnapshot();
      });
    });
  });
});
