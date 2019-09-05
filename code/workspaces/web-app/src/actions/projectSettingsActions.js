import getProjectUsers from '../api/projectSettingsService';

export const GET_PROJECT_USER_PERMISSIONS_ACTION = 'GET_PROJECT_USER_PERMISSIONS_ACTION';

const getProjectUserPermissions = projectId => ({
  type: GET_PROJECT_USER_PERMISSIONS_ACTION,
  payload: getProjectUsers(projectId),
});

export default {
  getProjectUserPermissions,
};
