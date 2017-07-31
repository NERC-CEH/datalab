import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import notebookRepository from '../dataaccess/notebookRepository';
import zeppelinTokenService from '../dataaccess/zeppelinTokenService';

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
    url: {
      type: GraphQLString,
    },
    cookie: {
      type: GraphQLString,
      resolve: (obj, args, { user }) => zeppelinTokenService.requestZeppelinCookie(obj, user),
    },
  },
});

export default {
  description: 'List of currently provisioned DataLabs Notebooks.',
  type: new GraphQLList(NotebookType),
  resolve: (obj, args, { user }) => notebookRepository.getAll(user),
};
