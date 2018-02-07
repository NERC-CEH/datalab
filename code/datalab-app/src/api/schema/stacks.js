import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { StackType } from '../types/stackTypes';
import stackRepository from '../dataaccess/stackRepository';

export const stacks = {
  description: 'List of currently provisioned DataLabs Stacks.',
  type: new GraphQLList(StackType),
  resolve: (obj, args, { user }) => stackRepository.getAll(user),
};

export const stacksByCategory = {
  description: 'List of currently provisioned DataLabs Stacks for the requested category.',
  type: new GraphQLList(StackType),
  args: {
    category: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (obj, { category }, { user }) => stackRepository.getByCategory(user, category),
};

export const stack = {
  description: 'Details of a single currently provisioned DataLab Stack.',
  type: StackType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: (obj, { id }, { user }) => stackRepository.getById(user, id),
};

export const checkStackName = {
  description: 'Details of a single currently provisioned DataLab Stack.',
  type: StackType,
  args: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (obj, { name }, { user }) => stackRepository.getAllByName(user, name),
};
