import { get } from 'lodash';
import request from '../auth/secureRequest';
import apiBase from './apiBase';

const apiURL = `${apiBase}/api`;

function loadNotebooks() {
  return request.post(apiURL, { query: '{ notebooks { id, displayName, type } }' })
    .then(res => get(res, 'data.data.notebooks'));
}

function getUrl(id) {
  return request.post(apiURL, { query: `{ notebook(id: "${id}") { redirectUrl } }` })
    .then(res => get(res, 'data.data.notebook'))
    .then((notebook) => {
      if (!notebook.redirectUrl) {
        throw new Error('Missing notebook URL');
      }
      return notebook;
    });
}

function createNotebook(notebook) {
  const mutation = { query: `mutation { createNotebook(notebook: { name: "${notebook.name}", notebookType: ${notebook.type}}) { name } }` };
  console.log(mutation);
  return request.post(apiURL, mutation)
    .then(res => get(res, 'data.data.notebook'));
}

export default {
  loadNotebooks,
  getUrl,
  createNotebook,
};
