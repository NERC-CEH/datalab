import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import notebookRepository from '../dataaccess/notebookRepository';
import notebookTokenService from '../dataaccess/notebookTokenService';

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
    type: {
      type: GraphQLString,
    },
    url: {
      type: GraphQLString,
    },
    internalEndpoint: {
      type: GraphQLString,
    },
    token: {
      type: GraphQLString,
      resolve: (obj, args, { user }) => notebookTokenService(obj, user),
    },
  },
});

export default {
  description: 'List of currently provisioned DataLabs Notebooks.',
  type: new GraphQLList(NotebookType),
  resolve: (obj, args, { user }) => notebookRepository.getAll(user),
};
