import { GraphQLString, GraphQLList } from 'graphql';
import getUserPermissions from '../dataaccess/userPermissionsService';

const userIdentity = {
  description: 'List permissions of current user',
  type: new GraphQLList(GraphQLString),
  resolve: (obj, params, { token }) => getUserPermissions(token),
};

export default userIdentity;
