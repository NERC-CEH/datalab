import axios from 'axios';
import config from '../config/config';
import { handleDeleteError } from './core';

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

  return createDeployment(manifest);
};

function getDeployment(name) {
  return axios.get(`${DEPLOYMENT_URL}/${name}`)
    .then(response => response.data)
    .catch(() => undefined);
}

function createDeployment(manifest) {
  return axios.post(DEPLOYMENT_URL, manifest, YAML_CONTENT_HEADER)
    .catch(handleError);
}

function updateDeployment(name, manifest) {
  return axios.put(`${DEPLOYMENT_URL}/${name}`, manifest, YAML_CONTENT_HEADER)
    .catch(handleError);
}

function deleteDeployment(name) {
  return axios.delete(`${DEPLOYMENT_URL}/${name}`)
    .then(response => response.data)
    .catch(handleDeleteError('deployment', name));
}

function handleError(error) {
  throw new Error(`Unable to create kubernetes deployment ${error.response.data.message}`);
}

export default { getDeployment, createDeployment, deleteDeployment, updateDeployment, createOrUpdateDeployment };
