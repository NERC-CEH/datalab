function getApiBase() {
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:8000';
  }

  return `${window.location.protocol}//api.${window.location.hostname}`;
}

export default getApiBase();
