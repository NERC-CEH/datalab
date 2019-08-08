import axios from 'axios';
import { get, mapKeys } from 'lodash';
import logger from 'winston';
import config from '../config/config';
import requestAccessToken from '../auth/accessToken';
import { getOrSetCacheAsyncWrapper } from '../cache/cache';

export const authZeroManagementApi = 'https://mjbr.eu.auth0.com/api/v2';

const accessTokenRequest = {
  audience: `https://${config.get('authZeroDomain')}/api/v2/`,
  client_id: config.get('userManagementClientId'),
  client_secret: config.get('userManagementClientSecret'),
};

const authKeyMapping = {
  name: 'name',
  user_id: 'userId',
};

export function asyncGetUsers() {
  return requestAccessToken(accessTokenRequest)
    .then(bearer => axios.get(`${authZeroManagementApi}/users`, {
      params: {
        fields: 'name,user_id',
      },
      headers: {
        Authorization: `Bearer ${bearer}`,
      },
    }).then(extractUsers)
      .then(processUsers)
      .catch(() => {
        throw new Error('Unable to retrieve users from User Management Service.');
      }))
    .catch((err) => {
      logger.error(err.message);
      throw err;
    });
}

// Pending users are users with an account but have not logged in; these users do not have a populated name field.
// This function filters pending users and returns only active users.
const extractUsers = response => get(response, 'data', []).filter(user => user.name);

const processUsers = users => users.map(user => mapKeys(user, (value, key) => authKeyMapping[key]));

const getUsers = () => getOrSetCacheAsyncWrapper('USERS_LIST', asyncGetUsers)();

export default { getUsers };
