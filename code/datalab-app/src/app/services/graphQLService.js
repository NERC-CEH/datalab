import request from 'superagent-bluebird-promise';
import { get } from 'lodash';

const apiURL = process.env.REACT_APP_API_URL || '/api';

function getCount() {
  return requestQuery(apiURL, '{ count }')
  .then(res => get(res, 'body.data.count'));
}

function incrementCount() {
  return requestQuery(apiURL, 'mutation { incrementCount }')
  .then(res => get(res, 'body.data.incrementCount'));
}

function resetCount() {
  return requestQuery(apiURL, 'mutation { resetCount }')
  .then(res => get(res, 'body.data.resetCount'));
}

function requestQuery(url, query) {
  const data = JSON.stringify({ query });
  return request.post(url)
  .set('Content-Type', 'application/json')
  .send(data);
}

export default {
  getCount,
  incrementCount,
  resetCount,
};
