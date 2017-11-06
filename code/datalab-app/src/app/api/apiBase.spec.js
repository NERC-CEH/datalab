import { getApiBase, getDomainInfo } from './apiBase';

describe('Get API Base', () => {
  it('should return the local API base as localhost:8000', () => {
    const location = { hostname: 'localhost' };
    const apiBase = getApiBase(location);
    expect(apiBase).toEqual('http://localhost:8000');
  });

  it('should return the API base as subdomain-api on the same protocol', () => {
    const location = {
      protocol: 'http:',
      hostname: 'datalab.datalabs.nerc.ac.uk',
    };
    const apiBase = getApiBase(location);
    expect(apiBase).toEqual('http://datalab-api.datalabs.nerc.ac.uk');
  });
});

describe('Get Domain Info', () => {
  it('should return the subdomain and domain correctly', () => {
    const location = {
      protocol: 'http:',
      hostname: 'datalab.datalabs.nerc.ac.uk',
    };
    const domainInfo = getDomainInfo(location);
    expect(domainInfo).toEqual({ subdomain: 'datalab', domain: 'datalabs.nerc.ac.uk' });
  });
});
