import axios from 'axios';
import generateOptions from '../auth/tokens';
import config from '../config';

const API_URL_BASE = config.get('infrastructureApi');

async function isNameUnique(projectKey, name, token) {
  const url = `${API_URL_BASE}/stacks/${projectKey}/${name}/isUnique`;
  const response = await axios.get(url, generateOptions(token));
  return response.data.isUnique;
}

export default isNameUnique;
