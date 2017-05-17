import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import configureCorsHeaders from './corsConfig';
import schema from './schema/index';
import config from './config';

const port = config.get('apiPort');

const api = graphqlExpress({ schema });
const graphiql = graphiqlExpress({ endpointURL: '/api' });
const app = express();

configureCorsHeaders(app);

app.use(bodyParser.json());

app.use('/api', api);

if (process.env.NODE_ENV !== 'production') {
  app.use('/graphiql', graphiql);
}

app.listen(port, () => console.log(`App listening on port ${port}.`));
