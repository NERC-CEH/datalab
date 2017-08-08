import notebookService from '../api/notebookService';

export const LOAD_NOTEBOOKS_ACTION = 'LOAD_NOTEBOOKS';
export const LOAD_NOTEBOOK_ACTION = 'LOAD_NOTEBOOK';
export const OPEN_NOTEBOOK_ACTION = 'OPEN_NOTEBOOK';

const loadNotebooks = () => ({
  type: LOAD_NOTEBOOKS_ACTION,
  payload: notebookService.loadNotebooks(),
});

const getUrl = id => ({
  type: LOAD_NOTEBOOK_ACTION,
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
