import permissionsService from '../api/userPermissionsService';

export const USER_LOGIN_ACTION = 'USER_LOGIN_ACTION';
export const GET_USER_PERMISSIONS_ACTION = 'GET_USER_PERMISSIONS_ACTION';

const userLogsIn = user => ({
  type: USER_LOGIN_ACTION,
  payload: user,
});

const getUserPermissions = () => ({
  type: GET_USER_PERMISSIONS_ACTION,
  payload: permissionsService.getUserPermissions(),
});

const authActions = {
  userLogsIn,
  getUserPermissions,
};

export default authActions;
