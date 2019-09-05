import axios from 'axios';

let version = 'development';

const getVersion = () => (version);

async function initialiseVersion() {
  if (!version) {
    version = await fetchVersion();
  }
  return version;
}

function fetchVersion() {
  return axios.get('/version.json')
    .then(response => response.data.version);
}

export { getVersion, initialiseVersion };
