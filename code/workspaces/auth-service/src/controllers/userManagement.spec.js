import httpMocks from 'node-mocks-http';
import userManagement from './userManagement';
import authZeroUserMgmt from '../userManagement/authZeroUserManagement';

jest.mock('../userManagement/authZeroUserManagement');
const getUsersMock = jest.fn().mockReturnValue(Promise.resolve('expectedValue'));
authZeroUserMgmt.getUsers = getUsersMock;

describe('user management controller', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('get users', () => {
    it('should return users as JSON', () => {
      const response = httpMocks.createResponse();

      userManagement.getUsers(undefined, response)
        .then(() => {
          expect(response.statusCode).toBe(200);
          expect(response._getData()) // eslint-disable-line no-underscore-dangle
            .toEqual(JSON.stringify('expectedValue'));
        });
    });
  });
});
