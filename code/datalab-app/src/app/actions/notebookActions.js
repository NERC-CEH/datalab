import notebookService from '../api/notebookService';

export const LOAD_NOTEBOOKS_ACTION = 'LOAD_NOTEBOOKS';
export const GET_NOTEBOOK_URL_ACTION = 'GET_NOTEBOOK_URL';
export const OPEN_NOTEBOOK_ACTION = 'OPEN_NOTEBOOK';
export const CREATE_NOTEBOOK_ACTION = 'CREATE_NOTEBOOK';
export const CHECK_NOTEBOOK_NAME_ACTION = 'CHECK_NOTEBOOK_NAME';

const loadNotebooks = () => ({
  type: LOAD_NOTEBOOKS_ACTION,
  payload: notebookService.loadNotebooks(),
});

const getUrl = id => ({
  type: GET_NOTEBOOK_URL_ACTION,
  payload: notebookService.getUrl(id),
});

const openNotebook = notebookUrl => ({
  type: OPEN_NOTEBOOK_ACTION,
  payload: window.open(notebookUrl),
});

const createNotebook = notebook => ({
  type: CREATE_NOTEBOOK_ACTION,
  payload: notebookService.createNotebook(notebook),
});

const checkNotebookName = notebookName => ({
  type: CHECK_NOTEBOOK_NAME_ACTION,
  payload: notebookService.checkNotebookName(notebookName),
});

export default {
  loadNotebooks,
  getUrl,
  openNotebook,
  createNotebook,
  checkNotebookName,
};
