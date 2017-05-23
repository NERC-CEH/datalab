function getApiBase(location) {
  if (location.hostname === 'localhost') {
    return 'http://localhost:8000';
  }

  const subdomain = location.hostname.split('.')[0];
  const domain = location.hostname.substring(subdomain.length + 1, location.hostname.length);
  return `${location.protocol}//${subdomain}-api.${domain}`;
}

export { getApiBase };
export default getApiBase(window.location);
