import { NotebookCreationType, NotebookDeletionType, NotebookType } from '../types/notebookTypes';
import config from '../config';
import notebookApi from '../infrastructure/notebookApi';

const DATALAB_NAME = config.get('datalabName');

export const createNotebook = {
  type: NotebookType,
  description: 'Create a new notebook',
  args: {
    notebook: { type: NotebookCreationType },
  },
  resolve: (obj, { notebook }, { user }) => notebookApi.createNotebook(user, DATALAB_NAME, notebook),
};

export const deleteNotebook = {
  type: NotebookType,
  description: 'Delete a notebook',
  args: {
    notebook: { type: NotebookDeletionType },
  },
  resolve: (obj, { notebook }, { user }) => notebookApi.deleteNotebook(user, DATALAB_NAME, notebook),
};
