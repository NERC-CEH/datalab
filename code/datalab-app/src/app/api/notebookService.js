import { get } from 'lodash';
import request from '../auth/secureRequest';
import apiBase from './apiBase';

const apiURL = `${apiBase}/api`;

function loadNotebooks() {
  return request.post(apiURL, { query: '{ notebooks { id, displayName, type } }' })
    .then(res => get(res, 'data.data.notebooks'));
}

function getUrl(id) {
  return request.post(apiURL, { query: `{ notebook(id: ${id}) { redirectUrl } }` })
    .then(res => get(res, 'data.data.notebook'))
    .then((notebook) => {
      if (!notebook.redirectUrl) {
        throw new Error('Missing notebook URL');
      }
      return notebook;
    });
}

export default {
  loadNotebooks,
  getUrl,
};
