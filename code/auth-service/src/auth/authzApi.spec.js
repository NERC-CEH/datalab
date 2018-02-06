import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import * as authzApi from './authzApi';
import * as cache from '../cache/cache';

jest.mock('winston');
jest.mock('../cache/cache');
const cacheReturnedMock = jest.fn();
const cacheWrapperMock = jest.fn().mockReturnValue(cacheReturnedMock);
cache.getOrSetCacheAsyncWrapper = cacheWrapperMock;

const mock = new MockAdapter(axios);
const { authOAuthEndpoint, authorisationExtensionEndpoint } = authzApi;

beforeEach(() => {
  mock.reset();
  cacheReturnedMock.mockClear();
  cacheWrapperMock.mockClear();
});

describe('Authorisation API', () => {
  describe('getAuthzAccessToken', () => {
    it('responds with access token', () => {
      mock.onPost(authOAuthEndpoint)
        .reply(200, { access_token: 'expectedAccessToken' });

      authzApi.getAuthzAccessToken()
        .then((token) => {
          expect(token).toBe('expectedAccessToken');
        });
    });

    it('throws error when unable to get access token', () => {
      mock.onPost(authOAuthEndpoint)
        .reply(401);

      authzApi.getAuthzAccessToken()
        .catch((err) => {
          expect(err.message).toBe('Unable to retrieve access token for the Authz Service.');
        });
    });
  });

  describe('getUserRoles', () => {
    it('responds with extracted roles', () => {
      mock.onPost(authOAuthEndpoint)
        .reply(200, { access_token: 'expectedAccessToken' });

      mock.onGet(`${authorisationExtensionEndpoint}/users/UserName/roles`)
        .reply(200, [{ name: 'firstRoleName' }, { name: 'secondRoleName' }]);

      authzApi.getUserRoles('UserName')
        .then((roles) => {
          expect(roles).toEqual(['firstRoleName', 'secondRoleName']);
        });
    });

    it('throws error when unable to get roles', () => {
      mock.onPost(authOAuthEndpoint)
        .reply(200, { access_token: 'expectedAccessToken' });

      mock.onGet(`${authorisationExtensionEndpoint}/users/UserName/roles`)
        .reply(401);

      authzApi.getUserRoles('UserName')
        .catch((err) => {
          expect(err.message).toBe('Unable to retrieve roles from the Authz Service.');
        });
    });
  });

  describe('cacheOrGetUserRoles', () => {
    it('calls getOrSetCacheAsyncWrapper with correct arguments', () => {
      authzApi.default('expectedUserName');

      expect(cacheWrapperMock).toHaveBeenCalledTimes(1);
      expect(cacheWrapperMock).toBeCalledWith('AUTH_ROLES_expectedUserName', authzApi.getUserRoles);
    });

    it('calls getOrSetCacheAsyncWrapper with correct arguments', () => {
      authzApi.default('expectedUserName');

      expect(cacheReturnedMock).toHaveBeenCalledTimes(1);
      expect(cacheReturnedMock).toBeCalledWith('expectedUserName');
    });
  });
});
