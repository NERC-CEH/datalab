import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import schema from './schema/index';

const port = 3001; // Change port for production

const api = graphqlExpress({ schema });
const graphiql = graphiqlExpress({ endpointURL: '/api' });
const app = express();

app.use('/api', bodyParser.json(), api);
app.use('/graphiql', graphiql); // Exclude in production build

app.listen(port, () => console.log(`App listening on port ${port}.`));
