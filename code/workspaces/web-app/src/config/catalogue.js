import axios from 'axios';

export async function catalogueConfig() {
  const { data } = await axios.get('/catalogue_config.json');
  return data;
}

export async function catalogueAvailable() {
  const config = await catalogueConfig();
  return config.available;
}
