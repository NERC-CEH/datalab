import { ApolloServer } from 'apollo-server-express';
import { importSchema } from 'graphql-import';
import { join } from 'path';

import resolvers from '../schema/resolvers';

async function configureGraphQL(app) {
  const typeDefs = importSchema(join(__dirname, '..', 'schema', 'schema.graphql'));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      user: req.user,
      token: req.headers.authorization,
      identity: req.headers.identity ? JSON.parse(req.headers.identity) : {},
    }),
    playground: process.env.NODE_ENV !== 'production',
  });

  await server.start();
  server.applyMiddleware({ app, path: '/api' });
}

export default { configureGraphQL };
