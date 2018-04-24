import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';
import internalNameChecker from '../dataaccess/internalNameChecker';

const checkNameUniqueness = {
  description: 'Checks internal name is unique.',
  type: GraphQLBoolean,
  args: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (obj, { name }, { user, token }) =>
    // Add permission check for STACKS_CREATE & STORAGE_CREATE permissions
    internalNameChecker({ user, token }, name),
};

export default checkNameUniqueness;
