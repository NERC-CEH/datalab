import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from 'graphql';

let count = 0;

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Query methods for server status and count values.',
  fields: {
    status: {
      description: 'Returns simple string to confirm GraphQL server is running.',
      type: GraphQLString,
      resolve: () => 'GraphQL server is alive!',
    },
    count: {
      description: 'Returns the current count value.',
      type: GraphQLInt,
      resolve: () => count,
    },
  },
});

const RootMutationType = new GraphQLObjectType({
  name: 'RootMutationType',
  description: 'Methods to mutate the count value.',
  fields: {
    incrementCount: {
      description: 'Mutate method to increment the count value.',
      type: GraphQLInt,
      resolve: () => { count += 1; return count; },
    },
    resetCount: {
      description: 'Mutate method to reset the count value to 0.',
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
