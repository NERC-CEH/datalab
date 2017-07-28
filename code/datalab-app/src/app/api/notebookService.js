import { get } from 'lodash';
import request from '../auth/secureRequest';
import apiBase from './apiBase';

const apiURL = `${apiBase}/api`;

function loadNotebooks() {
  return request.post(apiURL, { query: '{ notebooks { name url cookie } }' })
    .then(res => get(res, 'data.data.notebooks'));
}

export default {
  loadNotebooks,
};
