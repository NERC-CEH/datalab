import { GraphQLList } from 'graphql';
import UserType from '../types/userTypes';
import permissionChecker from '../auth/permissionChecker';
import { usersPermissions } from '../../shared/permissionTypes';
import userService from '../dataaccess/usersService';

const { USERS_LIST } = usersPermissions;

const users = {
  description: 'List of users within the current DataLab',
  type: new GraphQLList(UserType),
  resolve: (obj, args, { user, token }) =>
    permissionChecker(USERS_LIST, user, () => userService.getAll({ token })),
};

export default users;