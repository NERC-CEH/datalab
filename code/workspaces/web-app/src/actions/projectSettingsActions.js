import { getProjectUsers, addProjectUserPermission } from '../api/projectSettingsService';

export const GET_PROJECT_USER_PERMISSIONS_ACTION = 'GET_PROJECT_USER_PERMISSIONS_ACTION';
export const ADD_PROJECT_USER_PERMISSION_ACTION = 'ADD_PROJECT_USER_PERMISSION_ACTION';

const getProjectUserPermissions = projectKey => ({
  type: GET_PROJECT_USER_PERMISSIONS_ACTION,
  payload: getProjectUsers(projectKey),
});

const addUserPermission = (projectKey, user, role) => ({
  type: ADD_PROJECT_USER_PERMISSION_ACTION,
  payload: addProjectUserPermission(projectKey, user.userId, role)
    .then(result => ({ ...result, user })),
});

export default {
  getProjectUserPermissions,
  addUserPermission,
};
