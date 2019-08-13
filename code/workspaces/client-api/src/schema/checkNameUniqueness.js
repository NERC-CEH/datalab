import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';
import { permissionTypes } from 'common';
import internalNameChecker from '../dataaccess/internalNameChecker';
import permissionChecker from '../auth/permissionChecker';

const { elementPermissions: { STACKS_CREATE, STORAGE_CREATE } } = permissionTypes;

const checkNameUniqueness = {
  description: 'Checks internal name is unique.',
  type: GraphQLBoolean,
  args: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (obj, { name }, { user, token }) => permissionChecker([STACKS_CREATE, STORAGE_CREATE], user, () => internalNameChecker({ user, token }, name)),
};

export default checkNameUniqueness;
