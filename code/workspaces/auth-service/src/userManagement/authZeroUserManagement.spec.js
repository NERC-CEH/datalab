import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import userMgmt, { authZeroManagementApi, asyncGetUsers } from './authZeroUserManagement';
import * as requestAccessToken from '../auth/accessToken';
import * as cache from '../cache/cache';
import config from '../config/config';

jest.mock('winston');

jest.mock('../auth/accessToken');
const requestAccessTokenMock = jest.fn().mockReturnValue(Promise.resolve('expectedAccessToken'));
requestAccessToken.default = requestAccessTokenMock;

jest.mock('../cache/cache');
const cacheReturnedMock = jest.fn();
const cacheWrapperMock = jest.fn().mockReturnValue(cacheReturnedMock);
cache.getOrSetCacheAsyncWrapper = cacheWrapperMock;

config.set('userManagementClientId', 'userMgmtClientId');
config.set('userManagementClientSecret', 'userMgmtClientSecret');

const mock = new MockAdapter(axios);

const userList = [
  { name: 'firstName', user_id: 'one' },
  { name: 'secondName', user_id: 'two' },
  { user_id: 'three' },
];

describe('auth0 management API', () => {
  beforeEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('calls requestAccessToken with correct props', () => {
      mock.onGet(`${authZeroManagementApi}/users`)
        .reply(200, userList);

      return asyncGetUsers()
        .then(() => expect(requestAccessTokenMock).toHaveBeenCalledWith({
          audience: 'https://mjbr.eu.auth0.com/api/v2/',
          client_id: 'userMgmtClientId',
          client_secret: 'userMgmtClientSecret',
        }));
    });

    it('responds with filtered users', () => {
      mock.onGet(`${authZeroManagementApi}/users`)
        .reply(200, userList);

      return asyncGetUsers()
        .then(roles => expect(roles).toEqual([
          { name: 'firstName', userId: 'one' },
          { name: 'secondName', userId: 'two' },
        ]));
    });

    it('throws an error when unable to get users', () => {
      mock.onGet(`${authZeroManagementApi}/users`)
        .reply(401);

      return asyncGetUsers()
        .catch(err => expect(err.message).toBe('Unable to retrieve users from User Management Service.'));
    });
  });

  describe('cacheOrGetUsers', () => {
    it('calls getOrSetCacheAsyncWrapper with correct arguments', () => {
      userMgmt.getUsers();

      expect(cacheWrapperMock).toHaveBeenCalledTimes(1);
      expect(cacheWrapperMock).toBeCalledWith('USERS_LIST', asyncGetUsers);
    });

    it('calls getOrSetCacheAsyncWrapper with correct arguments', () => {
      userMgmt.getUsers();

      expect(cacheReturnedMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('get user', () => {
    it('should return the requested user', async () => {
      cacheReturnedMock.mockResolvedValue([
        { name: 'firstName', userId: 'one' },
        { name: 'secondName', userId: 'two' },
      ]);
      const user = await userMgmt.getUser('one');

      expect(user).toEqual({ name: 'firstName', userId: 'one' });
    });
  });
});
