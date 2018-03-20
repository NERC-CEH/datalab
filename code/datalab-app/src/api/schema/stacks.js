import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { StackType } from '../types/stackTypes';
import stackRepository from '../dataaccess/stackRepository';
import permissionChecker from '../auth/permissionChecker';
import { elementPermissions } from '../../shared/permissionTypes';

const { STACKS_LIST, STACKS_OPEN, STACKS_CREATE } = elementPermissions;

export const stacks = {
  description: 'List of currently provisioned DataLabs Stacks owned by user.',
  type: new GraphQLList(StackType),
  resolve: (obj, args, { user, token }) =>
    permissionChecker(STACKS_LIST, user, () => stackRepository.getAll({ user, token })),
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
    permissionChecker(STACKS_LIST, user, () => stackRepository.getAllByCategory({ user, token }, category)),
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
    permissionChecker(STACKS_OPEN, user, () => stackRepository.getById({ user, token }, id)),
};

export const checkStackName = {
  description: 'Returns ID value for stack with matching name.',
  type: GraphQLID,
  args: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (obj, { name }, { user, token }) =>
    permissionChecker(STACKS_CREATE, user, () => stackRepository.getByName({ user, token }, name)),
};
