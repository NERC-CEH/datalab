import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { authorise, verifyToken } from '../auth/authMiddleware';
import schema from '../schema/index';
import status from '../status';

function configureGraphQL(app) {
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
