import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import status from './status';
import { dataStorage, dataStore } from './dataStorage';
import notebooks from './notebooks';

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Root query methods for DataLabs.',
  fields: {
    status,
    dataStorage,
    dataStore,
    notebooks,
  },
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

export default schema;
