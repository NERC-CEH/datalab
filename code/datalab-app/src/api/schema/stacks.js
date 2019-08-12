import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { permissionTypes } from '../../shared';
import { StackType } from '../types/stackTypes';
import permissionChecker from '../auth/permissionChecker';
import stackService from '../dataaccess/stackService';

const { elementPermissions: { STACKS_LIST, STACKS_OPEN } } = permissionTypes;

export const stacks = {
  description: 'List of currently provisioned DataLabs Stacks owned by user.',
  type: new GraphQLList(StackType),
  resolve: (obj, args, { user, token }) =>
    permissionChecker(STACKS_LIST, user, () => stackService.getAll({ user, token })),
};

export const stacksByCategory = {
  description: 'List of currently provisioned DataLabs Stacks owned by user for the requested category.',
  type: new GraphQLList(StackType),
  args: {
    category: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (obj, { category }, { user, token }) =>
    permissionChecker(STACKS_LIST, user, () => stackService.getAllByCategory({ user, token }, category)),
};

export const stack = {
  description: 'Details of a single currently provisioned DataLab Stack owned by user.',
  type: StackType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: (obj, { id }, { user, token }) =>
    permissionChecker(STACKS_OPEN, user, () => stackService.getById({ user, token }, id)),
};
