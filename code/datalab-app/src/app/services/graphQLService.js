import request from 'axios';
import { get } from 'lodash';

const apiURL = process.env.REACT_APP_API_URL || '/api';

function getCount() {
  return request.post(apiURL, { query: '{ count }' })
    .then(res => get(res, 'data.data.count'));
}

function incrementCount() {
  return request.post(apiURL, { query: 'mutation { incrementCount }' })
    .then(res => get(res, 'data.data.incrementCount'));
}

function resetCount() {
  return request.post(apiURL, { query: 'mutation { resetCount }' })
    .then(res => get(res, 'data.data.resetCount'));
}

export default {
  getCount,
  incrementCount,
  resetCount,
};
