import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import notebookRepository from '../dataaccess/notebookRepository';
import notebookUrlService from '../dataaccess/notebookUrlService';

const NotebookType = new GraphQLObjectType({
  name: 'Notebook',
  description: 'Type to represent online notebooks',
  fields: {
    id: {
      type: GraphQLInt,
    },
    name: {
      type: GraphQLString,
    },
    displayName: {
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

export const notebooks = {
  description: 'List of currently provisioned DataLabs Notebooks.',
  type: new GraphQLList(NotebookType),
  resolve: (obj, args, { user }) => notebookRepository.getAll(user),
};

export const notebook = {
  description: 'Details of a single currently provisioned DataLab Notebook.',
  type: NotebookType,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  resolve: (obj, { id }, { user }) => notebookRepository.getById(user, id),
};
