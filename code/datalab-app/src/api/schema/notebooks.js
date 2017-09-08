import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';
import { NotebookType } from '../types/notebookTypes';
import notebookRepository from '../dataaccess/notebookRepository';

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
      type: new GraphQLNonNull(GraphQLID),
    },
  },
  resolve: (obj, { id }, { user }) => notebookRepository.getById(user, id),
};
