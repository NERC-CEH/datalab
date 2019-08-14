import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'Type to represent Auth0 User',
  fields: {
    name: {
      type: GraphQLString,
    },
    userId: {
      type: GraphQLID,
    },
  },
});

export default UserType;
