import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import http from 'http';
import schema from './schema/index';

const port = process.env.PORT || 8000;

const api = graphqlExpress({ schema });
const graphiql = graphiqlExpress({ endpointURL: '/api' });
const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.options('/*', (req, res) => {
  res.send(204);
});

app.use('/api', bodyParser.json(), api);

if (process.env.NODE_ENV !== 'production') {
  app.use('/graphiql', graphiql);
}

server.listen(port, () => console.log(`App listening on port ${port}.`));
