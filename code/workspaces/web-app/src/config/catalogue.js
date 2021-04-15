import axios from 'axios';

// This is a cached value.
// Initialise asynchronously before React starts.
// Get synchronously within React.
let catalogue;

async function initialiseCatalogue() {
  const { data } = await axios.get('/catalogue_asset_repo_config.json');
  ({ catalogue } = data);
}

const getCatalogue = () => (catalogue);

export { initialiseCatalogue, getCatalogue };
