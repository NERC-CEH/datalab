import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { StackType } from '../types/stackTypes';
import stackRepository from '../dataaccess/stackRepository';
import permissionChecker from '../auth/permissionChecker';

export const stacks = {
  description: 'List of currently provisioned DataLabs Stacks.',
  type: new GraphQLList(StackType),
  resolve: (obj, args, { user }) => permissionChecker('stacks:list', user, () => stackRepository.getAll(user)),
};

export const stacksByCategory = {
  description: 'List of currently provisioned DataLabs Stacks for the requested category.',
  type: new GraphQLList(StackType),
  args: {
    category: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (obj, { category }, { user }) =>
    permissionChecker('stacks:list', user, () => stackRepository.getByCategory(user, category)),
};

export const stack = {
  description: 'Details of a single currently provisioned DataLab Stack.',
  type: StackType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: (obj, { id }, { user }) =>
    permissionChecker('stacks:open', user, () => stackRepository.getById(user, id)),
};

export const checkStackName = {
  description: 'Details of a single currently provisioned DataLab Stack.',
  type: StackType,
  args: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (obj, { name }, { user }) =>
    permissionChecker('stacks:create', user, () => stackRepository.getAllByName(user, name)),
};
