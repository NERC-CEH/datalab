import axios from 'axios';

// This is a cached value.
// Initialise asynchronously before React starts.
// Get synchronously within React.
let version;

async function initialiseVersion() {
  const { data } = await axios.get('/version.json');
  ({ version } = data);
}

const getVersion = () => (version);

export { initialiseVersion, getVersion };
