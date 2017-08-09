import notebookService from '../api/notebookService';

export const LOAD_NOTEBOOKS_ACTION = 'LOAD_NOTEBOOKS';
export const GET_NOTEBOOK_URL_ACTION = 'GET_NOTEBOOK_URL';
export const OPEN_NOTEBOOK_ACTION = 'OPEN_NOTEBOOK';

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

export default {
  loadNotebooks,
  getUrl,
  openNotebook,
};
