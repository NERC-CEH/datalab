import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import status from './status';
import { dataStorage, dataStore } from './dataStorage';
import { notebook, notebooks } from './notebooks';
import { datalab, datalabs } from './datalabs';

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Root query methods for DataLabs.',
  fields: {
    status,
    dataStorage,
    dataStore,
    notebook,
    notebooks,
    datalab,
    datalabs,
  },
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

export default schema;
