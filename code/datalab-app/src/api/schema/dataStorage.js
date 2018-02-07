import {
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
} from 'graphql';
import { DataStoreType } from '../types/dataStoreTypes';
import dataStorageRepository from '../dataaccess/dataStorageRepository';

export const dataStorage = {
  description: 'List of currently provisioned DataLabs data storage.',
  type: new GraphQLList(DataStoreType),
  resolve: (obj, args, { user }) => dataStorageRepository.getAllActive(user),
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

export const checkDataStoreName = {
  description: 'Details of a single currently provisioned DataLab data store.',
  type: DataStoreType,
  args: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (obj, { name }, { user }) => dataStorageRepository.getAllByName(user, name),
};

