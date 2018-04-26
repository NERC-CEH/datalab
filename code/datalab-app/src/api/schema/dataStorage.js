import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import { DataStoreType } from '../types/dataStoreTypes';
import dataStorageRepository from '../dataaccess/dataStorageRepository';
import permissionChecker from '../auth/permissionChecker';
import { elementPermissions } from '../../shared/permissionTypes';

const { STORAGE_LIST, STORAGE_OPEN } = elementPermissions;

export const dataStorage = {
  description: 'List of currently provisioned DataLabs data storage.',
  type: new GraphQLList(DataStoreType),
  resolve: (obj, args, { user }) =>
    permissionChecker(STORAGE_LIST, user, () => dataStorageRepository.getAllActive(user)),
};

export const dataStore = {
  description: 'Details of a single Datalabs data store.',
  type: DataStoreType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: (obj, { id }, { user }) =>
    permissionChecker(STORAGE_OPEN, user, () => dataStorageRepository.getById(user, id)),
};
