import axios from 'axios';
import { get, mapKeys, find, difference } from 'lodash';
import Promise from 'bluebird';
import config from './config/config';
import logger from './logger';
import { USER } from './config/roles';
import getKnownUsers from './knownUsers/getKnownUsers';
import getAccessToken from './auth/getAccessToken';

const knownUserRoles = getKnownUsers();
const unknownUserRoles = [USER];

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

const getManagementToken = getAccessToken(managementTokenRequest);
const getAuthorisationToken = getAccessToken(authorisationTokenRequest);

const authKeyMapping = {
  name: 'name',
  user_id: 'userId',
};

const createHeaders = token => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const getUserList = () =>
  getManagementToken()
    .then(token =>
      axios.get(`${authZeroManagementApi}/users`, {
        params: {
          fields: 'name,user_id',
        },
        ...createHeaders(token),
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

const getAllRoles = () =>
  getAuthorisationToken()
    .then(token =>
      axios.get(`${authZeroAuthApi}/roles`, createHeaders(token)))
    .then(response => get(response, 'data.roles', []))
    .then(roles => roles.map(({ name, _id }) => ({ name, id: _id })))
    .catch((err) => { throw err; });

const getRoles = user =>
  getAuthorisationToken()
    .then(token =>
      axios.get(`${authZeroAuthApi}/users/${user.userId}/roles`, createHeaders(token)))
    .then(response => get(response, 'data'))
    .then(roleList => roleList.map(role => role.name))
    .then(roles => ({ ...user, roles }))
    .catch((err) => { throw err; });

const getUsersRoles = users =>
  Promise.mapSeries(users, user => getRoles(user));

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
    addRoles: difference(user.expectedRoles, user.roles).map(roleName => ({ roleName })),
    removeRoles: difference(user.roles, user.expectedRoles).map(roleName => ({ roleName })),
  }));

const selectModifiedUsers = users =>
  users.filter(({ addRoles, removeRoles }) => addRoles.length > 0 || removeRoles.length > 0);

const getRoleId = (name, roleList) => find(roleList, { name });

const findRoleIds = users =>
  getAllRoles()
    .then(roleList =>
      users.map(user => ({
        ...user,
        addRole: user.addRoles.map(({ roleName }) => getRoleId(roleName, roleList)),
        removeRole: user.removeRoles.map(({ roleName }) => getRoleId(roleName, roleList)),
      })));

const addUserRoles = user =>
  getAuthorisationToken()
    .then(token =>
      axios.patch(`${authZeroAuthApi}/users/${user.userId}/roles`, [user.role.id], createHeaders(token)))
    .then(() => logger.info(`Added user "${user.name}" to role "${user.role.name}"`))
    .then(() => user);

const execAddUserRoles = users =>
  Promise.mapSeries(users, user =>
    Promise.mapSeries(user.addRole, role => addUserRoles({ ...user, role })))
    .then(() => users);

const removeUserRoles = user =>
  getAuthorisationToken()
    .then(token =>
      axios.delete(`${authZeroAuthApi}/users/${user.userId}/roles`, {
        data: [user.role.id],
        ...createHeaders(token),
      }))
    .then(() => logger.info(`Remove user "${user.name}" from role "${user.role.name}"`))
    .then(() => user);

const execRemoveUserRoles = users =>
  Promise.mapSeries(users, user =>
    Promise.mapSeries(user.removeRole, role => removeUserRoles({ ...user, role })))
    .then(() => users);

const updateUsers = () =>
  getUserList()
    .then(getUsersRoles)
    .then(addExpectedRoles)
    .then(findRoleDiff)
    .then(selectModifiedUsers)
    .then(findRoleIds)
    .then(execAddUserRoles)
    .then(execRemoveUserRoles)
    .then(() => 'done');

export default updateUsers;
