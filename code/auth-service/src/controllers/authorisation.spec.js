import httpMocks from 'node-mocks-http';
import authorisation from './authorisation';

describe('authorisation controller', () => {
  describe('checkUser', () => {
    it('should return a 401 if no user has been set on the request', () => {
      const response = httpMocks.createResponse();

      authorisation.checkUser({ headers: { host: 'test.local' } }, response);

      expect(response.statusCode).toEqual(401);
      expect(response._getData()) // eslint-disable-line no-underscore-dangle
        .toEqual({ message: 'User not Authorised for domain test.local' });
    });

    it('should return 200 if a user has been set', () => {
      const response = httpMocks.createResponse();
      const request = {
        user: { name: 'Test' },
        headers: { host: 'test.local' },
      };

      authorisation.checkUser(request, response);

      expect(response.statusCode).toEqual(200);
      expect(response._getData()) // eslint-disable-line no-underscore-dangle
        .toEqual({ message: 'User Authorised for domain test.local' });
    });
  });
});
