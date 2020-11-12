import permissionsService from '../api/userPermissionsService';

export const GET_OTHER_USER_ROLES_ACTION = 'GET_OTHER_USER_ROLES_ACTION';

const getOtherUserRoles = userId => ({
  type: GET_OTHER_USER_ROLES_ACTION,
  payload: permissionsService.getOtherUserRoles(userId),
});

export default {
  getOtherUserRoles,
};
