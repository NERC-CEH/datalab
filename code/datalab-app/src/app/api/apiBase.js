function getApiBase() {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:8000';
  }

  return `http://api.${window.location.hostname}`;
}

export default getApiBase();
