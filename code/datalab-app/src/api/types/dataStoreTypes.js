import {
  GraphQLID,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLList,
} from 'graphql';
import { StackType } from '../types/stackTypes';
import minioTokenService from '../dataaccess/minioTokenService';
import stackRepository from '../dataaccess/stackRepository';

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
    displayName: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    type: {
      type: StorageType,
    },
    volumeSize: {
      type: GraphQLInt,
    },
    url: {
      type: GraphQLString,
    },
    internalEndpoint: {
      type: GraphQLString,
    },
    accessKey: {
      type: GraphQLString,
      resolve: (obj, args, { user }) => minioTokenService.requestMinioToken(obj, user),
    },
    stacksMountingStore: {
      type: new GraphQLList(StackType),
      resolve: ({ name }, args, { user }) => stackRepository.getByVolumeMount(user, name),
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
    displayName: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    type: {
      type: StorageType,
    },
    volumeSize: {
      type: GraphQLInt,
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
