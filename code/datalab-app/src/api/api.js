import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import configureCorsHeaders from './corsConfig';
import schema from './schema/index';
import config from './config';
import status from './status';
import connect from './connect';

const port = config.get('apiPort');
const connectPort = config.get('connectPort');

const api = graphqlExpress({ schema });
const graphiql = graphiqlExpress({ endpointURL: '/api' });
const app = express();

configureCorsHeaders(app);

app.use(bodyParser.json());

app.use('/api', api);
app.get('/status', status.get);

if (process.env.NODE_ENV !== 'production') {
  app.use('/graphiql', graphiql);
}

app.listen(port, () => console.log(`App listening on port ${port}.`));

connect.configureConnectEndpoint(['set'], connectPort);
