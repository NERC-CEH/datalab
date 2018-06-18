import axios from 'axios';
import { get, mapKeys, find, difference } from 'lodash';
import Promise from 'bluebird';
import config from './config/config';
import logger from './logger';
import { USER } from './config/roles';
import getKnownUsers from './knownUsers/getKnownUsers';

const knownUserRoles = getKnownUsers();
const unknownUserRoles = [USER];

const authOAuthEndpoint = `https://${config.get('authZeroDomain')}.eu.auth0.com/oauth/token`;
const authZeroManagementApi = `https://${config.get('authZeroDomain')}.eu.auth0.com/api/v2`;
const authZeroAuthApi = `https://${config.get('authZeroDomain')}.eu.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/api`;

const managementTokenRequest = {
  audience: `${authZeroManagementApi}/`,
  client_id: config.get('userManagementClientId'),
  client_secret: config.get('userManagementClientSecret'),
};

const authorisationTokenRequest = {
  audience: config.get('authorisationIdentifier'),
  client_id: config.get('authorisationClientId'),
  client_secret: config.get('authorisationClientSecret'),
};

const authKeyMapping = {
  name: 'name',
  user_id: 'userId',
};

const requestAccessToken = accessTokenRequest =>
  axios.post(authOAuthEndpoint, {
    ...accessTokenRequest,
    grant_type: 'client_credentials',
  })
    .then(response => get(response, 'data.access_token'))
    .then((response) => {
      logger.info(`Retrived access token for: ${accessTokenRequest.audience}`);
      return response;
    })
    .catch((err) => { throw err; });

const getUserList = () =>
  requestAccessToken(managementTokenRequest)
    .then(token =>
      axios.get(`${authZeroManagementApi}/users`, {
        params: {
          fields: 'name,user_id',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }))
    .then(response =>
      get(response, 'data', [])
        .filter(user => user.name))
    .then(users => users.map(user =>
      mapKeys(user, (value, key) => authKeyMapping[key])))
    .then((response) => {
      logger.info(`Fetched ${response.length} users.`);
      return response;
    })
    .catch((err) => { throw err; });

const getRoles = (token, user) =>
  axios.get(`${authZeroAuthApi}/users/${user.userId}/roles`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(response => get(response, 'data'))
    .then(roleList => roleList.map(role => role.name))
    .then(roles => ({ ...user, roles }))
    .catch((err) => { throw err; });

const getUsersRoles = users =>
  requestAccessToken(authorisationTokenRequest)
    .then(token => Promise.mapSeries(users, user =>
      getRoles(token, user)));

const getKnownExpectedRoles = name => get(find(knownUserRoles, { name }), 'roles', []);

const knownUsers = knownUserRoles.map(knownUser => knownUser.name);

const addExpectedRoles = users =>
  users.map((user) => {
    if (knownUsers.findIndex(knownUser => knownUser === user.name) > -1) {
      return { ...user, expectedRoles: getKnownExpectedRoles(user.name) };
    }
    return { ...user, expectedRoles: unknownUserRoles };
  });

const findRoleDiff = users =>
  users.map(user => ({
    ...user,
    addRole: difference(user.expectedRoles, user.roles),
    removeRole: difference(user.roles, user.expectedRoles),
  }));

const updateUsers = () =>
  getUserList()
    .then(getUsersRoles)
    .then(addExpectedRoles)
    .then(findRoleDiff);

export default updateUsers;
