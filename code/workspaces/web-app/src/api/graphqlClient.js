import { get } from 'lodash';
import request from '../auth/secureRequest';
import { createUrlFromPath } from '../core/getDomainInfo';

const apiURL = createUrlFromPath('api', '8000');

export const gqlQuery = (query, variables) => {
  const options = { headers: { 'Content-Type': 'application/json' } };
  const payload = JSON.stringify({ query: `query ${query}`, variables });
  return request.post(apiURL, payload, options)
    .then(res => get(res, 'data'));
};

export const gqlMutation = (mutation, variables) => {
  const options = { headers: { 'Content-Type': 'application/json' } };
  const payload = JSON.stringify({ query: `mutation ${mutation}`, variables });
  return request.post(apiURL, payload, options)
    .then(res => get(res, 'data'));
};
