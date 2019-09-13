import {
  getProjectUsers,
  addProjectUserPermission,
  removeProjectPermission,
} from '../api/projectSettingsService';

export const GET_PROJECT_USER_PERMISSIONS_ACTION = 'GET_PROJECT_USER_PERMISSIONS_ACTION';
export const ADD_PROJECT_USER_PERMISSION_ACTION = 'ADD_PROJECT_USER_PERMISSION_ACTION';
export const REMOVE_PROJECT_USER_PERMISSION_ACTION = 'REMOVE_PROJECT_USER_PERMISSION_ACTION';

const getProjectUserPermissions = projectKey => ({
  type: GET_PROJECT_USER_PERMISSIONS_ACTION,
  payload: getProjectUsers(projectKey),
});

const addUserPermission = (projectKey, user, role) => ({
  type: ADD_PROJECT_USER_PERMISSION_ACTION,
  payload: addProjectUserPermission(projectKey, user.userId, role)
    .then(result => ({ ...result, user })),
});

const removeUserPermission = (projectKey, user) => ({
  type: REMOVE_PROJECT_USER_PERMISSION_ACTION,
  payload: removeProjectPermission(projectKey, user.userId)
    .then(() => user),
});

export default {
  getProjectUserPermissions,
  addUserPermission,
  removeUserPermission,
};
