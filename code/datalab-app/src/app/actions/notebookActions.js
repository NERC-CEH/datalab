import notebookService from '../api/notebookService';
import zeppelinService from '../api/zeppelinService';

export const LOAD_NOTEBOOKS_ACTION = 'LOAD_NOTEBOOKS';
export const SET_COOKIE_ACTION = 'SET_NOTEBOOK_COOKIE';
export const OPEN_NOTEBOOK_ACTION = 'OPEN_NOTEBOOK';

const loadNotebooks = () => ({
  type: LOAD_NOTEBOOKS_ACTION,
  payload: notebookService.loadNotebooks(),
});

const setNotebookCookie = (notebookUrl, cookie) => ({
  type: SET_COOKIE_ACTION,
  payload: zeppelinService.setCookie(notebookUrl, cookie),
});

const openNotebook = notebookUrl => ({
  type: OPEN_NOTEBOOK_ACTION,
  payload: window.open(notebookUrl),
});

export default {
  loadNotebooks,
  setNotebookCookie,
  openNotebook,
};
