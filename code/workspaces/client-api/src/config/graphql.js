import { ApolloServer } from 'apollo-server-express';
import { importSchema } from 'graphql-import';
import { join } from 'path';

import resolvers from '../schema/resolvers';

function configureGraphQL(app) {
  const typeDefs = importSchema(join(__dirname, '..', 'schema', 'schema.graphql'));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      user: req.user,
      token: req.headers.authorization,
    }),
    playground: process.env.NODE_ENV !== 'production',
  });

  server.applyMiddleware({ app, path: '/api' });
}

export default { configureGraphQL };
