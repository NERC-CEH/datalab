import axios from 'axios';
import config from '../config/config';

const API_BASE = config.get('kubernetesApi');
const NAMESPACE = config.get('podNamespace');

const SECRET_URL = `${API_BASE}/api/v1/namespaces/${NAMESPACE}/secrets`;

/**
 * Kubernetes does not allow PUT to be used if a secret does not exist and similarly does
 * not allow POST to be used if it does. Give we intend this operation to overwrite an existing
 * secret we will first check if the secret exists and then use PUT or POST as required.
 * @param name the secret name
 * @param value the value to store
 * @returns {Promise.<T>}
 */
function createSecret(name, value) {
  const secret = {
    apiVersion: 'v1',
    kind: 'Secret',
    metadata: { name },
    stringData: value,
  };

  const options = { validateStatus: status => status >= 200 && status < 500 };

  return axios.get(`${SECRET_URL}/${name}`, options)
    .then(createOrReplace(secret, name))
    .catch((error) => { throw new Error(`Unable to create kubernetes secret ${error.response.data.message}`); });
}

const createOrReplace = (secret, name) => (response) => {
  if (response.status === 200) {
    return axios.put(`${SECRET_URL}/${name}`, secret);
  }

  return axios.post(SECRET_URL, secret);
};

export default { createSecret };
