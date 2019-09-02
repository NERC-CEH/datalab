import httpMocks from 'node-mocks-http';
import userManagement from './userManagement';
import authZeroUserMgmt from '../userManagement/authZeroUserManagement';

jest.mock('../userManagement/authZeroUserManagement');
const getUsersMock = jest.fn().mockReturnValue(Promise.resolve('expectedValue'));
const getUserMock = jest.fn();
authZeroUserMgmt.getUsers = getUsersMock;
authZeroUserMgmt.getUser = getUserMock;

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

  describe('get user', () => {
    it('should return user if found', async () => {
      const returnUser = { userId: 123, name: 'test' };
      getUserMock.mockResolvedValue(returnUser);
      const request = httpMocks.createRequest({ params: { userId: 123 } });
      const response = httpMocks.createResponse();

      await userManagement.getUser(request, response);

      expect(getUserMock).toBeCalledWith(123);
      expect(response.statusCode).toBe(200);
      expect(response._getData()).toEqual(returnUser); // eslint-disable-line no-underscore-dangle
    });

    it('should return 404 if user not found', async () => {
      getUserMock.mockResolvedValue();

      const request = httpMocks.createRequest({ params: { userId: 123 } });
      const response = httpMocks.createResponse();

      await userManagement.getUser(request, response);

      expect(response.statusCode).toBe(404);
    });
  });
});
