import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import userIdentityService from './userIdentityService';

const mock = new MockAdapter(axios);

const userInfoUrl = 'https://mjbr.eu.auth0.com/userinfo';
const authServiceUrl = 'http://localhost:9000/permissions';

describe('User Identity Service', () => {
  beforeEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  describe('getUserInfo', () => {
    it('requests userinfo from Auth0', () => {
      const expectedUserInfo = {
        sub: 'authUserName',
        name: 'someone@somewhere',
        nickname: 'Mr User',
      };

      mock.onGet(userInfoUrl)
        .reply(200, expectedUserInfo);

      return userIdentityService.getUserInfo('tokenToken')
        .then(user => expect(user)
          .toEqual(expectedUserInfo));
    });

    it('throws an error if request fails', () => {
      mock.onGet(userInfoUrl)
        .reply(403, { status: 'FORBIDDEN' });

      return userIdentityService.getUserInfo('tokenToken')
        .catch(err => expect(err.message)
          .toBe('Unable to get user info Error: Request failed with status code 403'));
    });
  });

  describe('getPermissions', () => {
    it('requests permissions from auth service', () => {
      const expectedPermissions = [
        'project1:element:access',
        'project10:thing:open',
      ];

      mock.onGet(authServiceUrl)
        .reply(200, { permissions: expectedPermissions });

      return userIdentityService.getUserPermissions('tokenToken')
        .then(permissions => expect(permissions)
          .toEqual(expectedPermissions));
    });

    it('returns empty array for missing permissions', () => {
      mock.onGet(authServiceUrl)
        .reply(200, {});

      return userIdentityService.getUserPermissions('tokenToken')
        .then(permissions => expect(permissions)
          .toEqual([]));
    });

    it('throws an error if request fails', () => {
      mock.onGet(authServiceUrl)
        .reply(403, { status: 'FORBIDDEN' });

      return userIdentityService.getUserPermissions('tokenToken')
        .catch(err => expect(err.message)
          .toBe('Unable to get user permissions Error: Request failed with status code 403'));
    });
  });
});
