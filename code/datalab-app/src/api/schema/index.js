import { find } from 'lodash';
import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import version from '../version';

const exampleStorage = [
  { id: 1, name: 'disk 1', storageType: 1, capacityTotal: 1, capacityUsed: 1, linkToStorage: 'here' },
  { id: 2, name: 'disk 2', storageType: 1, capacityTotal: 1, capacityUsed: 1, linkToStorage: 'here' },
];

const StorageType = new GraphQLEnumType({
  name: 'StorageType',
  description: 'Data store classes within DataLabs',
  values: {
    nfs: {
      description: 'Network File System (NFS) share.',
      value: 1,
    },
  },
});

const DataStoreType = new GraphQLObjectType({
  name: 'DataStore',
  description: 'DataLabs data store type.',
  fields: {
    id: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLString,
    },
    storageType: {
      type: StorageType,
    },
    capacityTotal: {
      type: GraphQLInt,
    },
    capacityUsed: {
      type: GraphQLInt,
    },
    linkToStorage: {
      type: GraphQLString,
    },
  },
});

const RootQueryType = new GraphQLObjectType({
  name: 'RootQueryType',
  description: 'Root query methods for DataLabs.',
  fields: {
    status: {
      description: 'Status string to confirm GraphQL server is running.',
      type: GraphQLString,
      resolve: () => `GraphQL server is ${version ? `running version ${version}` : 'is alive!'}`,
    },
    dataStorage: {
      description: 'List of currently provisioned DataLabs data storage.',
      type: new GraphQLList(DataStoreType),
      resolve: () => exampleStorage,
    },
    dataStore: {
      description: 'Details of a single Datalabs data store.',
      type: DataStoreType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLInt),
        },
      },
      resolve: (parent, { id }) => find(exampleStorage, { id }),
    },
  },
});

const schema = new GraphQLSchema({
  query: RootQueryType,
});

export default schema;
