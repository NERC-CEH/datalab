import { NotebookCreationType, NotebookType } from '../types/notebookTypes';
import config from '../config';
import notebookApi from '../infrastructure/notebookApi';

const DATALAB_NAME = config.get('datalabName');

const createNotebook = {
  type: NotebookType,
  description: 'Create a new article',
  args: {
    notebook: { type: NotebookCreationType },
  },
  resolve: (obj, { notebook }, { user }) => notebookApi.createNotebook(user, DATALAB_NAME, notebook),
};

export default createNotebook;
