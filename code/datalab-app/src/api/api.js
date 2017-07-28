import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import logger from 'winston';
import configureCorsHeaders from './corsConfig';
import authMiddleware from './auth/authMiddleware';
import schema from './schema/index';
import config from './config';
import status from './status';
import connect from './connect';

const port = config.get('apiPort');
const connectPort = config.get('connectPort');

const api = graphqlExpress(request => ({ schema, context: { user: request.user } }));
const graphiql = graphiqlExpress({ endpointURL: '/graphiqlApi' });
const app = express();

logger.level = config.get('logLevel');

configureCorsHeaders(app);

app.use(bodyParser.json());

app.use('/api', authMiddleware, api);
app.get('/status', status.get);

if (process.env.NODE_ENV !== 'production') {
  app.use('/graphiqlApi', api);
  app.use('/graphiql', graphiql);
}

app.listen(port, () => logger.info(`App listening on port ${port}.`));

connect.configureConnectEndpoint(['set'], connectPort);
