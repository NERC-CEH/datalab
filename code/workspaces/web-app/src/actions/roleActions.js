import rolesService from '../api/rolesService';

export const GET_ALL_USERS_AND_ROLES_ACTION = 'GET_ALL_USERS_AND_ROLES_ACTION';
export const SET_INSTANCE_ADMIN_ACTION = 'SET_INSTANCE_ADMIN_ACTION';
export const SET_DATA_MANAGER_ACTION = 'SET_DATA_MANAGER_ACTION';
export const SET_CATALOGUE_ROLE_ACTION = 'SET_CATALOGUE_ROLE_ACTION';

const getAllUsersAndRoles = () => ({
  type: GET_ALL_USERS_AND_ROLES_ACTION,
  payload: rolesService.getAllUsersAndRoles(),
});

const setInstanceAdmin = (userId, instanceAdmin) => ({
  type: SET_INSTANCE_ADMIN_ACTION,
  payload: rolesService.setInstanceAdmin(userId, instanceAdmin),
});

const setDataManager = (userId, dataManager) => ({
  type: SET_DATA_MANAGER_ACTION,
  payload: rolesService.setDataManager(userId, dataManager),
});

const setCatalogueRole = (userId, catalogueRole) => ({
  type: SET_CATALOGUE_ROLE_ACTION,
  payload: rolesService.setCatalogueRole(userId, catalogueRole),
});

export default { getAllUsersAndRoles, setInstanceAdmin, setDataManager, setCatalogueRole };
