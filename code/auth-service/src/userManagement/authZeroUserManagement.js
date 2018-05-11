import axios from 'axios';
import { get } from 'lodash';
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

export function asyncGetUsers() {
  return requestAccessToken(accessTokenRequest)
    .then(bearer =>
      axios.get(`${authZeroManagementApi}/users`, {
        params: {
          fields: 'name,user_id',
        },
        headers: {
          Authorization: `Bearer ${bearer}`,
        },
      }).then(extractUsers)
        .catch(() => {
          throw new Error('Unable to retrieve users from User Management Service.');
        }))
    .catch((err) => {
      logger.error(err.message);
      throw err;
    });
}

const extractUsers = response =>
  // Pending users are users with an account but have not logged in; these users do not have a populated name field.
  // This function filters pending users and returns only active users.
  get(response, 'data', []).filter(user => user.name);

const getUsers = () =>
  getOrSetCacheAsyncWrapper('USERS_LIST', asyncGetUsers)();

export default { getUsers };
