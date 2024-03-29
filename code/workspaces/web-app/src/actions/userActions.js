import listUsersService from '../api/listUsersService';

export const LIST_USERS_ACTION = 'LIST_USERS';

const listUsers = () => ({
  type: LIST_USERS_ACTION,
  payload: listUsersService.listUsers(),
});

const userActions = { listUsers };

export default userActions;
