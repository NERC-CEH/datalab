import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import cacheGetUserRoles, { getUserRoles, authorisationExtensionEndpoint } from './authzApi';
import * as requestAccessToken from './accessToken';
import * as cache from '../cache/cache';

jest.mock('winston');

jest.mock('./accessToken');
const requestAccessTokenMock = jest.fn().mockReturnValue(Promise.resolve('expectedAccessToken'));
requestAccessToken.default = requestAccessTokenMock;

jest.mock('../cache/cache');
const cacheReturnedMock = jest.fn();
const cacheWrapperMock = jest.fn().mockReturnValue(cacheReturnedMock);
cache.getOrSetCacheAsyncWrapper = cacheWrapperMock;

const mock = new MockAdapter(axios);

describe('Authorisation API', () => {
  beforeEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  describe('getUserRoles', () => {
    it('calls requestAccessToken with correct props', () => {
      mock.onGet(`${authorisationExtensionEndpoint}/users/UserName/roles`)
        .reply(200, [{ name: 'firstRoleName' }, { name: 'secondRoleName' }]);

      return getUserRoles('UserName')
        .then(() =>
          expect(requestAccessTokenMock).toHaveBeenCalledWith({
            audience: 'authzIdentifier',
            client_id: 'authzClientId',
            client_secret: 'authzClientSecret',
          }));
    });

    it('responds with extracted roles', () => {
      mock.onGet(`${authorisationExtensionEndpoint}/users/UserName/roles`)
        .reply(200, [{ name: 'firstRoleName' }, { name: 'secondRoleName' }]);

      return getUserRoles('UserName')
        .then(roles =>
          expect(roles).toEqual(['firstRoleName', 'secondRoleName']));
    });

    it('throws error when unable to get roles', () => {
      mock.onGet(`${authorisationExtensionEndpoint}/users/UserName/roles`)
        .reply(401);

      return getUserRoles('UserName')
        .catch(err =>
          expect(err.message).toBe('Unable to retrieve roles from the Authz Service.'));
    });
  });

  describe('cacheOrGetUserRoles', () => {
    it('calls getOrSetCacheAsyncWrapper with correct arguments', () => {
      cacheGetUserRoles('expectedUserName');

      expect(cacheWrapperMock).toHaveBeenCalledTimes(1);
      expect(cacheWrapperMock).toBeCalledWith('AUTH_ROLES_expectedUserName', getUserRoles);
    });

    it('calls getOrSetCacheAsyncWrapper with correct arguments', () => {
      cacheGetUserRoles('expectedUserName');

      expect(cacheReturnedMock).toHaveBeenCalledTimes(1);
      expect(cacheReturnedMock).toBeCalledWith('expectedUserName');
    });
  });
});
