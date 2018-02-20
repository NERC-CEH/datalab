import { getDomainInfo, replaceSubdomain, extendSubdomain } from './getDomainInfo';

describe('Extend Subdomain', () => {
  it('should generate an extended subdomain', () => {
    // Arrange/Act
    const location = {
      protocol: 'https:',
      hostname: 'testlab.test-datalabs.nerc.ac.uk',
    };
    const subdomain = extendSubdomain('docs', 3000, location);

    // Assert
    expect(subdomain).toBe('https://testlab-docs.test-datalabs.nerc.ac.uk');
  });

  it('should return correct fallback address when using localhost', () => {
    // Arrange/Act
    const location = {
      protocol: 'http:',
      hostname: 'localhost',
    };
    const subdomain = extendSubdomain('docs', 3000, location);

    // Assert
    expect(subdomain).toBe('http://localhost:3000');
  });

  it('should return an address using the same protocol', () => {
    // Arrange/Act
    const location = {
      protocol: 'http:',
      hostname: 'datalab.datalabs.nerc.ac.uk',
    };
    const apiBase = extendSubdomain('api', 8000, location);

    // Assert
    expect(apiBase).toEqual('http://datalab-api.datalabs.nerc.ac.uk');
  });
});

describe('Replace subdomain', () => {
  it('should generate correct address when location has a subdomain', () => {
    // Arrange/Act
    const location = {
      protocol: 'https:',
      hostname: 'testlab.test-datalabs.nerc.ac.uk',
    };
    const address = replaceSubdomain('discourse', 'https://www.discourse.org/', location);

    // Assert
    expect(address).toBe('https://discourse.test-datalabs.nerc.ac.uk');
  });

  it('should return the alturnative address when using localhost', () => {
    // Arrange/Act
    const location = {
      protocol: 'http:',
      hostname: 'localhost',
    };
    const address = replaceSubdomain('discourse', 'https://www.discourse.org/', location);

    // Assert
    expect(address).toBe('https://www.discourse.org/');
  });
});

describe('Get Domain Info', () => {
  it('should return the subdomain and domain correctly', () => {
    // Arrange/Act
    const location = {
      protocol: 'http:',
      hostname: 'datalab.datalabs.nerc.ac.uk',
    };
    const domainInfo = getDomainInfo(location);

    // Assert
    expect(domainInfo).toEqual({
      protocol: 'http:',
      subdomain: 'datalab',
      domain: 'datalabs.nerc.ac.uk',
    });
  });
});
