import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import status from './status';
import { dataStorage, dataStore } from './dataStorage';
import { stack, stacks, stacksByCategory } from './stacks';
import checkNameUniqueness from './checkNameUniqueness';
import { datalab, datalabs } from './datalabs';
import { createStack, deleteStack } from './mutateStack';
import { createDataStore, deleteDataStore } from './mutateDataStorage';
import userPermissions from './userPermissions';

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Root query methods for DataLabs.',
  fields: {
    status,
    dataStorage,
    dataStore,
    stack,
    stacks,
    stacksByCategory,
    datalab,
    datalabs,
    userPermissions,
    checkNameUniqueness,
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
