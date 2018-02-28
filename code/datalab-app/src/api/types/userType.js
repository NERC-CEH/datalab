import { GraphQLString, GraphQLObjectType, GraphQLList } from 'graphql';
import userIdentityRepository from '../dataaccess/userIdentityService';

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'DataLabs user type',
  fields: {
    sub: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    nickname: {
      type: GraphQLString,
    },
    picture: {
      type: GraphQLString,
    },
    permissions: {
      type: new GraphQLList(GraphQLString),
      resolve: (obj, args, { user, authZeroToken }) =>
        userIdentityRepository.getUserPermissions({ user, authZeroToken }),
    },
  },
});

export default UserType;
