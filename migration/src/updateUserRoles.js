import axios from 'axios';
import { get, mapKeys, find, difference } from 'lodash';
import Promise from 'bluebird';
import logger from './logger';

const USER_MANAGEMENT_API_CLIENT_ID = process.env.USER_MANAGEMENT_API_CLIENT_ID;
const USER_MANAGEMENT_API_CLIENT_SECRET = process.env.USER_MANAGEMENT_API_CLIENT_SECRET;
const AUTHORISATION_API_IDENTIFIER = process.env.AUTHORISATION_API_IDENTIFIER;
const AUTHORISATION_API_CLIENT_ID = process.env.AUTHORISATION_API_CLIENT_ID;
const AUTHORISATION_API_CLIENT_SECRET = process.env.AUTHORISATION_API_CLIENT_SECRET;

const authZeroDomain = 'mjbr';
const authOAuthEndpoint = `https://${authZeroDomain}.eu.auth0.com/oauth/token`;
const authZeroManagementApi = `https://${authZeroDomain}.eu.auth0.com/api/v2`;
const authZeroAuthApi = `https://${authZeroDomain}.eu.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/api`;

const PROJECT = 'project';
// const ADMIN = `${PROJECT}:admin`;
const USER = `${PROJECT}:user`;
// const VIEWER = `${PROJECT}:viewer`;
// const INSTANCE_ADMIN = 'instance-admin';

const unknownUserRoles = [USER];

const knownUserRoles = [
];

const knownUsers = knownUserRoles.map(knownUser => knownUser.name);

const managementTokenRequest = {
  audience: `${authZeroManagementApi}/`,
  client_id: USER_MANAGEMENT_API_CLIENT_ID,
  client_secret: USER_MANAGEMENT_API_CLIENT_SECRET,
};

const authorisationTokenRequest = {
  audience: AUTHORISATION_API_IDENTIFIER,
  client_id: AUTHORISATION_API_CLIENT_ID,
  client_secret: AUTHORISATION_API_CLIENT_SECRET,
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
