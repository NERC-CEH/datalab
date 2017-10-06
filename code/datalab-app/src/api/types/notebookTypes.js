import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
  GraphQLEnumType,
  GraphQLInputObjectType,
} from 'graphql';
import notebookUrlService from '../dataaccess/notebookUrlService';
import { getNotebookTypes } from '../../shared/notebookTypes';

export const NotebookType = new GraphQLObjectType({
  name: 'Notebook',
  description: 'Type to represent online notebooks',
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
      type: GraphQLString,
    },
    url: {
      type: GraphQLString,
    },
    internalEndpoint: {
      type: GraphQLString,
    },
    redirectUrl: {
      type: GraphQLString,
      resolve: (obj, args, { user }) => notebookUrlService(obj, user),
    },
  },
});

export const NotebookTypeEnum = new GraphQLEnumType({
  name: 'NotebookType',
  description: 'Notebook types within DataLabs',
  values: getNotebookTypes(),
});

export const NotebookCreationType = new GraphQLInputObjectType({
  name: 'NotebookCreationRequest',
  description: 'Type to describe the mutation for creating a new Notebook.',
  fields: {
    displayName: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    type: {
      type: NotebookTypeEnum,
    },
    description: {
      type: GraphQLString,
    },
  },
});

export const NotebookDeletionType = new GraphQLInputObjectType({
  name: 'NotebookDeletionRequest',
  description: 'Type to describe the mutation for deleting a new Notebook.',
  fields: {
    name: {
      type: GraphQLString,
    },
    type: {
      type: NotebookTypeEnum,
    },
  },
});
