import httpMocks from 'node-mocks-http';
import jwt from 'jsonwebtoken';
import authorisation from './authorisation';
import * as getRoles from '../auth/authzApi';

jest.mock('../auth/authzApi');
const getRolesMock = jest.fn().mockReturnValue(Promise.resolve([]));
getRoles.default = getRolesMock;

describe('authorisation controller', () => {
  beforeEach(() => jest.clearAllMocks());

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

  describe('generatePermissionToken', () => {
    it('should generate and return access token', () => {
      const response = httpMocks.createResponse();
      const request = { user: { sub: 'expectedUserName' } };

      authorisation.generatePermissionToken(request, response)
        .then(() => {
          const { token } = response._getData(); // eslint-disable-line no-underscore-dangle
          const { aud, iss, user } = jwt.decode(token);
          expect({ aud, iss, user }).toMatchSnapshot();
        });
    });

    it('should generate token with correct roles', () => {
      const response = httpMocks.createResponse();
      const request = { user: { sub: 'expectedUserName' } };
      const expectedRoles = ['expected', 'roles'];
      getRolesMock.mockReturnValue(Promise.resolve(expectedRoles));

      authorisation.generatePermissionToken(request, response)
        .then(() => {
          const { token } = response._getData(); // eslint-disable-line no-underscore-dangle
          const { roles } = jwt.decode(token);
          expect(roles).toEqual(expectedRoles);
        });
    });

    it('should generate token with 2 minute expiration', () => {
      const response = httpMocks.createResponse();
      const request = { user: { sub: 'expectedUserName' } };
      const expectedRoles = ['expected', 'roles'];
      getRolesMock.mockReturnValue(Promise.resolve(expectedRoles));

      authorisation.generatePermissionToken(request, response)
        .then(() => {
          const { token } = response._getData(); // eslint-disable-line no-underscore-dangle
          const { exp, iat } = jwt.decode(token);
          expect(exp - iat).toBe(120);
        });
    });

    it('should return 500 on failure to get roles', () => {
      const response = httpMocks.createResponse();
      const request = { user: { sub: 'expectedUserName' } };
      const errMessage = { message: 'Something broke' };
      getRolesMock.mockReturnValue(Promise.reject(errMessage));

      authorisation.generatePermissionToken(request, response)
        .then(() => {
          expect(response.statusCode).toBe(500);
          expect(response._getData()) // eslint-disable-line no-underscore-dangle
            .toEqual(errMessage);
        });
    });
  });

  describe('serveJWKS', () => {
    it('should serve the development public key', () => {
      const response = httpMocks.createResponse();

      authorisation.serveJWKS({}, response);

      expect(response.statusCode).toEqual(200);
      expect(response._getData()) // eslint-disable-line no-underscore-dangle
        .toMatchSnapshot();
    });
  });
});
