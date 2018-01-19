import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import status from './status';
import { dataStorage, dataStore, checkDataStoreName } from './dataStorage';
import { stack, stacks, stacksByCategory, checkStackName } from './stacks';
import { datalab, datalabs } from './datalabs';
import { createStack, deleteStack } from './mutateStack';
import { createDataStore, deleteDataStore } from './mutateDataStorage';

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Root query methods for DataLabs.',
  fields: {
    status,
    dataStorage,
    dataStore,
    checkDataStoreName,
    stack,
    stacks,
    stacksByCategory,
    checkStackName,
    datalab,
    datalabs,
  },
});

const RootMutationType = new GraphQLObjectType({
  name: 'RootMutationType',
  description: 'Root mutation methods for Datalabs.',
  fields: {
    createStack,
    deleteStack,
    createDataStore,
    deleteDataStore,
  },
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

export default schema;
