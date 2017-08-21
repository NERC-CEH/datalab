import {
  GraphQLID,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import dataStorageRepository from '../dataaccess/dataStorageRepository';
import minioTokenService from '../dataaccess/minioTokenService';

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

export const dataStorage = {
  description: 'List of currently provisioned DataLabs data storage.',
  type: new GraphQLList(DataStoreType),
  resolve: (obj, args, { user }) => dataStorageRepository.getAll(user),
};

export const dataStore = {
  description: 'Details of a single Datalabs data store.',
  type: DataStoreType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: (obj, { id }, { user }) => dataStorageRepository.getById(user, id),
};
