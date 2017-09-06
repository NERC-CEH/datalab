import axios from 'axios';
import has from 'lodash/has';
import config from '../config/config';

const API_BASE = config.get('kubernetesApi');
const NAMESPACE = config.get('podNamespace');

const SECRET_URL = `${API_BASE}/api/v1/namespaces/${NAMESPACE}/secrets`;

function createOrUpdateSecret(name, value) {
  return getSecret(name)
    .then(createOrReplace(name, value));
}

const createOrReplace = (name, value) => (existingSecret) => {
  if (existingSecret) {
    return updateSecret(name, value);
  }

  return createSecret(name, value);
};

function getSecret(name) {
  return axios.get(`${SECRET_URL}/${name}`)
    .then(response => response.data)
    .catch(() => undefined);
}

function createSecret(name, value) {
  return axios.post(SECRET_URL, createPayload(name, value))
    .catch(handleError);
}

function updateSecret(name, value) {
  return axios.put(`${SECRET_URL}/${name}`, createPayload(name, value))
    .catch(handleError);
}

function createPayload(name, value) {
  return {
    apiVersion: 'v1',
    kind: 'Secret',
    metadata: { name },
    stringData: value,
  };
}

function handleError(error) {
  if (has(error, 'response.data.message')) {
    throw new Error(`Unable to create kubernetes secret ${error.response.data.message}`);
  }
  throw new Error(`Unable to create kubernetes secret ${error}`);
}

export default { getSecret, createSecret, updateSecret, createOrUpdateSecret };
