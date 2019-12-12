import axios from 'axios';
import config from '../config';

const infraServiceUrl = `${config.get('infrastructureApi')}`;

async function getLogsByName(projectKey, name, token) {
  const response = await axios.get(`${infraServiceUrl}/logs/${projectKey}/${name}`, generateOptions(token));
  return response.data;
}

const generateOptions = token => ({
  headers: {
    authorization: token,
  },
});

export default {
  getLogsByName,
};
