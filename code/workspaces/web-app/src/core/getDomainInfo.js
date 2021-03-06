function extendSubdomain(extension, localhostPort, location) {
  const domainInfo = getDomainInfo(location);

  if (domainInfo === 'localhost') {
    return `http://localhost:${localhostPort}`;
  }

  return `${domainInfo.protocol}//${domainInfo.subdomain}-${extension}.${domainInfo.domain}`;
}

function createUrlFromPath(path, localhostPort, location) {
  const domainInfo = getDomainInfo(location);

  if (domainInfo === 'localhost') {
    return `http://localhost:${localhostPort}/${path}`;
  }

  return `${domainInfo.baseUrl}/${path}`;
}

function replaceSubdomain(subdomain, altHref, location) {
  const domainInfo = getDomainInfo(location);

  if (domainInfo === 'localhost') {
    return altHref || 'localhost';
  }

  return `${domainInfo.protocol}//${subdomain}.${domainInfo.domain}`;
}

function getDomainInfo(location) {
  const currentLocation = location || window.location;

  if (currentLocation.hostname === 'localhost') {
    return 'localhost';
  }

  const { protocol, hostname } = currentLocation;
  const subdomain = hostname.split('.')[0];
  const domain = hostname.substring(subdomain.length + 1, hostname.length);
  const baseUrl = `${protocol}//${subdomain}.${domain}`;
  return { baseUrl, protocol, subdomain, domain };
}

export { getDomainInfo, replaceSubdomain, extendSubdomain, createUrlFromPath };
