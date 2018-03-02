import permissionsService from '../api/userPermissionsService';

export const USER_LOGIN = 'USER_LOGIN';
export const GET_USER_PERMISSIONS = 'GET_USER_PERMISSIONS';

const userLogsIn = user => ({
  type: USER_LOGIN,
  payload: user,
});

const getUserPermissions = () => ({
  type: GET_USER_PERMISSIONS,
  payload: permissionsService(),
});

export default {
  userLogsIn,
  getUserPermissions,
};
