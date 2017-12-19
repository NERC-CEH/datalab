import {
  GraphQLID,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInputObjectType,
} from 'graphql';
import minioTokenService from '../dataaccess/minioTokenService';

export const StorageType = new GraphQLEnumType({
  name: 'StorageType',
  description: 'Data store classes within DataLabs',
  values: {
    nfs: {
      description: 'Network File System (NFS) share.',
      value: 1,
    },
  },
});

export const DataStoreType = new GraphQLObjectType({
  name: 'DataStore',
  description: 'DataLabs data store type.',
  fields: {
    id: {
      type: GraphQLID,
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
    internalEndpoint: {
      type: GraphQLString,
    },
    accessKey: {
      type: GraphQLString,
      resolve: (obj, args, { user }) => minioTokenService.requestMinioToken(obj, user),
    },
  },
});

export const DataStorageCreationType = new GraphQLInputObjectType({
  name: 'DataStorageCreationRequest',
  description: 'Type to describe the mutation for creating a new data store',
  fields: {
    name: {
      type: GraphQLString,
    },
    type: {
      type: StorageType,
    },
    capacityTotal: {
      type: GraphQLInt,
    },
    linkToStorage: {
      type: GraphQLString,
    },
    internalEndpoint: {
      type: GraphQLString,
    },
  },
});

export const DataStorageDeletionType = new GraphQLInputObjectType({
  name: 'DataStorageDeletionRequest',
  description: 'Type to describe the mutation for creating a new data store',
  fields: {
    name: {
      type: GraphQLString,
    },
  },
});
