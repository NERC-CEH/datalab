import axios from 'axios';

export async function catalogueConfig() {
  const { data: { catalogue } } = await axios.get('/catalogue_asset_repo_config.json');
  return catalogue;
}

export async function catalogueAvailable() {
  const config = await catalogueConfig();
  return config.available;
}
