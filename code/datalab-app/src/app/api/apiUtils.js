function getApiBase() {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:8000';
  }

  const host = window.location.hostname.replace('mydatalab', 'api');

  return `http://${host}`;
}

export default { getApiBase };
