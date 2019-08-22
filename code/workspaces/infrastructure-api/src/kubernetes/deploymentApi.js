import axios from 'axios';
import logger from '../config/logger';
import config from '../config/config';
import { handleCreateError, handleDeleteError } from './core';

const API_BASE = config.get('kubernetesApi');
const NAMESPACE = config.get('podNamespace');

const DEPLOYMENT_URL = `${API_BASE}/apis/apps/v1beta1/namespaces/${NAMESPACE}/deployments`;

const YAML_CONTENT_HEADER = { headers: { 'Content-Type': 'application/yaml' } };

function createOrUpdateDeployment(name, manifest) {
  return getDeployment(name, manifest)
    .then(createOrReplace(name, manifest));
}

const createOrReplace = (name, manifest) => (existingDeployment) => {
  if (existingDeployment) {
    return updateDeployment(name, manifest);
  }

  return createDeployment(name, manifest);
};

function getDeployment(name) {
  return axios.get(`${DEPLOYMENT_URL}/${name}`)
    .then(response => response.data)
    .catch(() => undefined);
}

function createDeployment(name, manifest) {
  logger.info('Creating deployment: %s', name);
  return axios.post(DEPLOYMENT_URL, manifest, YAML_CONTENT_HEADER)
    .catch(handleCreateError);
}

function updateDeployment(name, manifest) {
  logger.info('Updating deployment: %s', name);
  return axios.put(`${DEPLOYMENT_URL}/${name}`, manifest, YAML_CONTENT_HEADER)
    .catch(handleCreateError);
}

function deleteDeployment(name) {
  logger.info('Deleting deployment: %s', name);
  const deleteOptions = {
    kind: 'DeleteOptions',
    apiVersion: 'v1',
    propagationPolicy: 'Foreground',
  };

  return axios.delete(`${DEPLOYMENT_URL}/${name}`, { data: deleteOptions })
    .then(response => response.data)
    .catch(handleDeleteError('deployment', name));
}

export default { getDeployment, createDeployment, deleteDeployment, updateDeployment, createOrUpdateDeployment };
