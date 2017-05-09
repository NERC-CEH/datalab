import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

let count = 0;

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',

  fields: {
    status: {
      type: GraphQLString,
      resolve: () => 'GraphQL server is alive!',
    },
    count: {
      type: GraphQLInt,
      resolve: () => count,
    },
  },
});

const RootMutationType = new GraphQLObjectType({
  name: 'RootMutationType',

  fields: {
    incrementCount: {
      type: GraphQLInt,
      resolve: () => { count += 1; return count; },
    },
    resetCount: {
      type: GraphQLInt,
      resolve: () => { count = 0; return count; },
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

export default schema;
