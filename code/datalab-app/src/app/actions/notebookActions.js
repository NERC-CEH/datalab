import notebookService from '../api/notebookService';
import zeppelinService from '../api/zeppelinService';

export const LOAD_NOTEBOOKS_ACTION = 'LOAD_NOTEBOOKS';
export const OPEN_NOTEBOOK_ACTION = 'OPEN_NOTEBOOK';

const loadNotebooks = () => ({
  type: LOAD_NOTEBOOKS_ACTION,
  payload: notebookService.loadNotebooks(),
});

const openNotebook = (notebookUrl, cookie) => ({
  type: OPEN_NOTEBOOK_ACTION,
  payload: zeppelinService.openNotebook(notebookUrl, cookie),
});

export default {
  loadNotebooks,
  openNotebook,
};
