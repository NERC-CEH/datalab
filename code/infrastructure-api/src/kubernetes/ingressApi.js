import axios from 'axios';
import logger from '../config/logger';
import config from '../config/config';
import { handleCreateError, handleDeleteError } from './core';

const API_BASE = config.get('kubernetesApi');
const NAMESPACE = config.get('podNamespace');

const INGRESS_URL = `${API_BASE}/apis/extensions/v1beta1/namespaces/${NAMESPACE}/ingresses`;

const YAML_CONTENT_HEADER = { headers: { 'Content-Type': 'application/yaml' } };

function createOrUpdateIngress(name, manifest) {
  return getIngress(name, manifest)
    .then(createOrReplace(name, manifest));
}

const createOrReplace = (name, manifest) => (existingIngress) => {
  if (existingIngress) {
    return updateIngress(name, manifest);
  }

  return createIngress(name, manifest);
};

function getIngress(name) {
  return axios.get(`${INGRESS_URL}/${name}`)
    .then(response => response.data)
    .catch(() => undefined);
}

function createIngress(name, manifest) {
  logger.info('Creating ingress: %s', name);
  return axios.post(INGRESS_URL, manifest, YAML_CONTENT_HEADER)
    .catch(handleCreateError);
}

function updateIngress(name, manifest) {
  logger.info('Updating ingress: %s', name);
  return axios.put(`${INGRESS_URL}/${name}`, manifest, YAML_CONTENT_HEADER)
    .catch(handleCreateError);
}

function deleteIngress(name) {
  logger.info('Deleting ingress: %s', name);
  return axios.delete(`${INGRESS_URL}/${name}`)
    .then(response => response.data)
    .catch(handleDeleteError('ingress', name));
}

export default { getIngress, createIngress, deleteIngress, updateIngress, createOrUpdateIngress };
