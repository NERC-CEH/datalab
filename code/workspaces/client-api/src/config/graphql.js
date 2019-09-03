import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { importSchema } from 'graphql-import';
import { join } from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { authorise, verifyToken } from '../auth/authMiddleware';
import status from '../status';
import resolvers from '../schema/resolvers';

function configureGraphQL(app) {
  const typeDefs = importSchema(join(__dirname, '..', 'schema', 'schema.graphql'));
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const api = graphqlExpress(request => ({
    schema,
    context: {
      user: request.user,
      token: request.headers.authorization,
    },
  }));

  const graphiql = graphiqlExpress({
    endpointURL: '/graphiqlApi',
  });

  app.use('/api', authorise, verifyToken, api);
  app.get('/status', status.get);

  if (process.env.NODE_ENV !== 'production') {
    app.use('/graphiqlApi', api);
    app.use('/graphiql', graphiql);
  }
}

export default { configureGraphQL };
