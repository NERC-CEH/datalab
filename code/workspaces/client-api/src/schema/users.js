import { GraphQLList } from 'graphql';
import { permissionTypes } from 'common';
import permissionChecker from '../auth/permissionChecker';
import userService from '../dataaccess/usersService';
import UserType from '../types/userTypes';

const { usersPermissions: { USERS_LIST } } = permissionTypes;

const users = {
  description: 'List of users within the current DataLab',
  type: new GraphQLList(UserType),
  resolve: (obj, args, { user, token }) =>
    permissionChecker(USERS_LIST, user, () => userService.getAll({ token })),
};

export default users;
