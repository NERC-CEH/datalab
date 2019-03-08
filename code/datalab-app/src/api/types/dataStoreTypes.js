import {
  GraphQLID,
  GraphQLEnumType,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLList,
} from 'graphql';
import { StackType } from './stackTypes';
import minioTokenService from '../dataaccess/minioTokenService';
import stackService from '../dataaccess/stackService';
import { READY } from '../../shared/statusTypes';
import { usersPermissions } from '../../shared/permissionTypes';
import permissionChecker from '../auth/permissionChecker';

const { USERS_LIST } = usersPermissions;

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
    users: {
      type: new GraphQLList(GraphQLString),
      resolve: (obj, args, { user }) => permissionChecker(USERS_LIST, user, () => obj.users),
    },
    accessKey: {
      type: GraphQLString,
      resolve: (obj, args, { user }) => minioTokenService.requestMinioToken(obj, user),
    },
    stacksMountingStore: {
      type: new GraphQLList(StackType),
      resolve: ({ name }, args, { user, token }) => stackService.getAllByVolumeMount({ user, token }, name),
    },
    status: {
      // Artificially tag storage as ready
      type: GraphQLString,
      resolve: () => READY,
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

export const DataStorageUpdateType = new GraphQLInputObjectType({
  name: 'DataStorageUpdateRequest',
  description: 'Type to describe the mutation for updating or deleting a new data store',
  fields: {
    name: {
      type: GraphQLString,
    },
    users: {
      type: new GraphQLList(GraphQLString),
    },
  },
});
