function getApiBase(location) {
  if (location.hostname === 'localhost') {
    return 'http://localhost:8000';
  }

  const domainInfo = getDomainInfo(location);
  return `${location.protocol}//${domainInfo.subdomain}-api.${domainInfo.domain}`;
}

function getDomainInfo(location) {
  const currentLocation = location || window.location;

  if (currentLocation.hostname === 'localhost') {
    return 'localhost';
  }

  const hostname = currentLocation.hostname;
  const subdomain = hostname.split('.')[0];
  const domain = hostname.substring(subdomain.length + 1, hostname.length);

  return { subdomain, domain };
}

export { getApiBase, getDomainInfo };
export default getApiBase(window.location);
