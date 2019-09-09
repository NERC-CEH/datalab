import { ApolloServer } from 'apollo-server';
import { importSchema } from 'graphql-import';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { join } from 'path';

import { mockResolvers, mockTypes } from './schema/mockResolvers';

function createMockGraphQLServer() {
  const typeDefs = importSchema(join(__dirname, '.', 'schema', 'schema.graphql'));

  const schema = makeExecutableSchema({ typeDefs, resolvers: mockResolvers });

  // Add mock functions to schema.
  // The preserveResolvers flag means any already created resolves are not overwritten
  addMockFunctionsToSchema({ schema, mocks: mockTypes, preserveResolvers: true });

  return new ApolloServer({
    schema,
    playground: process.env.NODE_ENV !== 'production',
  });
}

const server = createMockGraphQLServer();

server.listen({ port: 8000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
