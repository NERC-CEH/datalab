import { getApiBase } from './apiBase';

test('test that local API base is localhost:8000', () => {
  const location = { hostname: 'localhost' };
  const apiBase = getApiBase(location);
  expect(apiBase).toEqual('http://localhost:8000');
});

test('test that API base is served at subdomain-api on same protocol', () => {
  const location = {
    protocol: 'http:',
    hostname: 'datalab.datalabs.nerc.ac.uk',
  };
  const apiBase = getApiBase(location);
  expect(apiBase).toEqual('http://datalab-api.datalabs.nerc.ac.uk');
});
