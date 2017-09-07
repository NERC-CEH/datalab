import {
  GraphQLInt,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLString,
} from 'graphql';
import config from '../config';
import notebookApi from '../infrastructure/notebookApi';

const DATALAB_NAME = config.get('datalabName');

const NotebookTypeEnum = new GraphQLEnumType({
  name: 'NotebookType',
  description: 'Notebook types within DataLabs',
  values: {
    jupyter: {
      description: 'A Jupyter Notebook',
      value: 'jupyter',
    },
  },
});

const NotebookCreationType = new GraphQLInputObjectType({
  name: 'NotebookCreationRequest',
  description: 'Type to describe the mutation for creating a new Notebook.',
  fields: {
    name: {
      type: GraphQLString,
    },
    notebookType: {
      type: NotebookTypeEnum,
    },
  },
});

const createNotebook = {
  type: GraphQLInt,
  description: 'Create a new article',
  args: {
    input: { type: NotebookCreationType },
  },
  resolve: (obj, { input }, { user }) => notebookApi.createNotebook(user, DATALAB_NAME, input),
};

export default createNotebook;
