import request from 'superagent-bluebird-promise';
import { get } from 'lodash';

function getCount() {
  return requestQuery('/api', '{ count }')
  .then(res => get(res, 'body.data.count'));
}

function incrementCount() {
  return requestQuery('/api', 'mutation { incrementCount }')
  .then(res => get(res, 'body.data.incrementCount'));
}

function resetCount() {
  return requestQuery('/api', 'mutation { resetCount }')
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
