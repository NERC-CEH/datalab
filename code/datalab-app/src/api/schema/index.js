import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import status from './status';
import { dataStorage, dataStore } from './dataStorage';
import { notebook, notebooks, checkNotebookName } from './notebooks';
import { datalab, datalabs } from './datalabs';
import createNotebook from './createNotebook';

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Root query methods for DataLabs.',
  fields: {
    status,
    dataStorage,
    dataStore,
    notebook,
    notebooks,
    checkNotebookName,
    datalab,
    datalabs,
  },
});

const RootMutationType = new GraphQLObjectType({
  name: 'RootMutationType',
  description: 'Root mutation methods for Datalabs.',
  fields: {
    createNotebook,
  },
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

export default schema;
