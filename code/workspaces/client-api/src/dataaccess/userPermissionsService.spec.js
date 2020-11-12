import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import config from '../config';
import permissionsService from './userPermissionsService';

const mock = new MockAdapter(axios);

const AUTH_URL_BASE = config.get('authorisationService');
const authServiceUrl = `${AUTH_URL_BASE}/permissions`;

describe('User Identity Service', () => {
  beforeEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  it('requests permissions from auth service', () => {
    const expectedPermissions = [
      'project1:element:access',
      'project10:thing:open',
    ];

    mock.onGet(authServiceUrl)
      .reply(200, { permissions: expectedPermissions });

    return permissionsService.getUserPermissions({ userName: 'user1' }, 'tokenToken')
      .then(permissions => expect(permissions)
        .toEqual(expectedPermissions));
  });

  it('returns empty array for missing permissions', () => {
    mock.onGet(authServiceUrl)
      .reply(200, {});

    return permissionsService.getUserPermissions({ userName: 'user1' }, 'tokenToken')
      .then(permissions => expect(permissions)
        .toEqual([]));
  });

  it('throws an error if request fails', () => {
    mock.onGet(authServiceUrl)
      .reply(403, { status: 'FORBIDDEN' });

    return permissionsService.getUserPermissions({ userName: 'user1' }, 'tokenToken')
      .catch(err => expect(err.message)
        .toBe('Unable to get user permissions Error: Request failed with status code 403'));
  });
});
