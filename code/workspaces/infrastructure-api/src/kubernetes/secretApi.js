import axios from 'axios';
import logger from '../config/logger';
import config from '../config/config';
import { handleCreateError, handleDeleteError } from './core';

const API_BASE = config.get('kubernetesApi');

const getSecretUrl = namespace => `${API_BASE}/api/v1/namespaces/${namespace}/secrets`;

function createOrUpdateSecret(name, namespace, value) {
  return getSecret(name, namespace)
    .then(createOrReplace(name, namespace, value));
}

const createOrReplace = (name, namespace, value) => (existingSecret) => {
  if (existingSecret) {
    return updateSecret(name, namespace, value);
  }

  return createSecret(name, namespace, value);
};

function getSecret(name, namespace) {
  return axios.get(`${getSecretUrl(namespace)}/${name}`)
    .then(response => response.data)
    .catch(() => undefined);
}

function createSecret(name, namespace, value) {
  logger.info('Creating secret: %s in namespace %s', name, namespace);
  return axios.post(getSecretUrl(namespace), createPayload(name, value))
    .catch(handleCreateError('secret', name));
}

function updateSecret(name, namespace, value) {
  logger.info('Updating secret: %s in namespace %s', name, namespace);
  return axios.put(`${getSecretUrl(namespace)}/${name}`, createPayload(name, value))
    .catch(handleCreateError('secret', name));
}

function createPayload(name, value) {
  return {
    apiVersion: 'v1',
    kind: 'Secret',
    metadata: { name },
    stringData: value,
  };
}

function deleteSecret(name, namespace) {
  logger.info('Deleting secret: %s', name);
  return axios.delete(`${getSecretUrl(namespace)}/${name}`)
    .then(response => response.data)
    .catch(handleDeleteError('secret', name));
}

export default { getSecret, deleteSecret, createSecret, updateSecret, createOrUpdateSecret };
