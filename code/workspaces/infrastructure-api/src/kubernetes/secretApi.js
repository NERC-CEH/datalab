import axios from 'axios';
import { merge } from 'lodash';
import logger from '../config/logger';
import config from '../config/config';
import { handleCreateError, handleDeleteError } from './core';

const API_BASE = config.get('kubernetesApi');

const getSecretUrl = (namespace, name) => {
  const nameComponent = name ? `/${name}` : '';
  return `${API_BASE}/api/v1/namespaces/${namespace}/secrets${nameComponent}`;
};

function createOrUpdateSecret(name, namespace, value, additionalMetadata) {
  return getSecret(name, namespace)
    .then(createOrReplace(name, namespace, value, additionalMetadata));
}

const createOrReplace = (name, namespace, value, additionalMetadata) => (existingSecret) => {
  if (existingSecret) {
    return updateSecret(name, namespace, value, additionalMetadata);
  }

  return createSecret(name, namespace, value, additionalMetadata);
};

function getSecret(name, namespace) {
  return axios.get(getSecretUrl(namespace, name))
    .then(response => response.data)
    .catch(() => undefined);
}

function createSecret(name, namespace, value, additionalMetadata) {
  logger.info('Creating secret: %s in namespace %s', name, namespace);
  return axios.post(getSecretUrl(namespace), createPayload(name, value, additionalMetadata))
    .catch(handleCreateError('secret', name));
}

function updateSecret(name, namespace, value, additionalMetadata) {
  logger.info('Updating secret: %s in namespace %s', name, namespace);
  return axios.put(getSecretUrl(namespace, name), createPayload(name, value, additionalMetadata))
    .catch(handleCreateError('secret', name));
}

function createPayload(name, value, additionalMetadata) {
  const payload = {
    apiVersion: 'v1',
    kind: 'Secret',
    metadata: { name },
    stringData: value,
  };

  if (additionalMetadata) {
    merge(payload.metadata, additionalMetadata);
  }

  return payload;
}

function deleteSecret(name, namespace) {
  logger.info('Deleting secret: %s', name);
  return axios.delete(getSecretUrl(namespace, name))
    .then(response => response.data)
    .catch(handleDeleteError('secret', name));
}

export default { getSecret, deleteSecret, createSecret, updateSecret, createOrUpdateSecret };
