import axios from 'axios';
import { get, mapKeys, find } from 'lodash';
import logger from 'winston';
import config from '../config/config';
import requestAccessToken from '../auth/accessToken';
import { getOrSetCacheAsyncWrapper } from '../cache/cache';

export const authZeroManagementApi = `https://${config.get('authZeroDomain')}/api/v2`;
const PAGE_LIMIT = 100;
const AUTH0_MAXIMUM = 1000;

const accessTokenRequest = () => ({
  audience: `${authZeroManagementApi}/`,
  client_id: config.get('userManagementClientId'),
  client_secret: config.get('userManagementClientSecret'),
});

const authKeyMapping = {
  name: 'name',
  user_id: 'userId',
};

export async function asyncGetUsers() {
  try {
    try {
      let page = 0;
      let users = [];
      let extractedUsers = [];
      let activeUsers = [];
      let allUsers = [];

      const tokenRequest = await accessTokenRequest();
      const bearer = await requestAccessToken(tokenRequest);

      // Below approach is required as the auth0 API results are paginated, with a maximum
      // overall limit, as well as a maximum per_page limit. This approach is taken instead
      // of requesting multiple pages simultaneously (e.g Promise.all).
      // Additionally extractUsers no longer filters for auth0 'active' users as the raw
      // return number is required to determine whether return page is full or not hence
      // this logic is moved into the loop.
      /* eslint-disable no-await-in-loop */
      do {
        users = await fetchUsers(bearer, page);
        extractedUsers = await extractUsers(users);
        activeUsers = extractedUsers.filter(user => user.name);
        allUsers = allUsers.concat(activeUsers);
        page += 1;
      } while (extractedUsers.length === PAGE_LIMIT && page < (AUTH0_MAXIMUM / PAGE_LIMIT));
      /* eslint-enable no-await-in-loop */

      const processedUsers = await processUsers(allUsers);
      return processedUsers;
    } catch (err) {
      logger.error(err.message);
      throw new Error(`Unable to retrieve users from User Management Service - ${err.message}`);
    }
  } catch (err) {
    logger.error(err.message);
    throw err;
  }
}

const fetchUsers = (bearer, page) => axios.get(`${authZeroManagementApi}/users`, {
  params: {
    fields: 'name,user_id',
    per_page: PAGE_LIMIT,
    page,
  },
  headers: {
    Authorization: `Bearer ${bearer}`,
  },
});

const extractUsers = response => get(response, 'data', []);

const processUsers = users => users.map(user => mapKeys(user, (value, key) => authKeyMapping[key]));

const getUsers = () => getOrSetCacheAsyncWrapper('USERS_LIST', asyncGetUsers)();

const getUser = async (userId) => {
  const users = await getUsers();
  return find(users, { userId });
};

export default { getUser, getUsers };
