import rolesService from '../api/rolesService';

export const GET_ALL_USERS_AND_ROLES_ACTION = 'GET_ALL_USERS_AND_ROLES_ACTION';

const getAllUsersAndRoles = () => ({
  type: GET_ALL_USERS_AND_ROLES_ACTION,
  payload: rolesService.getAllUsersAndRoles(),
});

export default { getAllUsersAndRoles };
