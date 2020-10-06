import axios from 'axios';
import logger from '../config/logger';
import config from '../config/config';
import { handleCreateError, handleDeleteError } from './core';

const API_BASE = config.get('kubernetesApi');

const getDeploymentUrl = (namespace, name) => {
  const nameComponent = name ? `/${name}` : '';
  return `${API_BASE}/apis/apps/v1/namespaces/${namespace}/deployments${nameComponent}`;
};

const getDeploymentScaleUrl = (namespace, name) => `${getDeploymentUrl(namespace, name)}/scale`;

const YAML_CONTENT_HEADER = { headers: { 'Content-Type': 'application/yaml' } };

const PATCH_CONTENT_HEADER = { headers: { 'Content-Type': 'application/merge-patch+json' } };

function createOrUpdateDeployment(name, namespace, manifest) {
  return getDeployment(name, namespace)
    .then(createOrReplace(name, namespace, manifest));
}

const createOrReplace = (name, namespace, manifest) => (existingDeployment) => {
  if (existingDeployment) {
    return updateDeployment(name, namespace, manifest);
  }

  return createDeployment(name, namespace, manifest);
};

function getDeployment(name, namespace) {
  return axios.get(getDeploymentUrl(namespace, name))
    .then(response => response.data)
    .catch(() => undefined);
}

function createDeployment(name, namespace, manifest) {
  logger.info('Creating deployment: %s in namespace: %s', name, namespace);
  return axios.post(getDeploymentUrl(namespace), manifest, YAML_CONTENT_HEADER)
    .catch(handleCreateError('deployment', name));
}

function updateDeployment(name, namespace, manifest) {
  logger.info('Updating deployment: %s in namespace: %s', name, namespace);
  return axios.put(getDeploymentUrl(namespace, name), manifest, YAML_CONTENT_HEADER)
    .catch(handleCreateError('deployment', name));
}

function deleteDeployment(name, namespace) {
  logger.info('Deleting deployment: %s in namespace: %s', name, namespace);
  const deleteOptions = {
    kind: 'DeleteOptions',
    apiVersion: 'v1',
    propagationPolicy: 'Foreground',
  };

  return axios.delete(getDeploymentUrl(namespace, name), { data: deleteOptions })
    .then(response => response.data)
    .catch(handleDeleteError('deployment', name));
}

async function getStatusReplicas(name, namespace) {
  const response = await axios.get(getDeploymentScaleUrl(namespace, name));
  const replicas = response.data.status.replicas || 0;
  return replicas;
}

async function getSpecReplicas(name, namespace) {
  const response = await axios.get(getDeploymentScaleUrl(namespace, name));
  const replicas = response.data.spec.replicas || 0;
  return replicas;
}

async function setSpecReplicas(name, namespace, specReplicas) {
  const response = await axios.patch(
    getDeploymentScaleUrl(namespace, name),
    { spec: { replicas: specReplicas } },
    PATCH_CONTENT_HEADER,
  );

  // Wait for a total of upto approx. 10s for desired number of replicas.
  // Wait 100ms between checks.
  // Waiting helps to prevents http 409 (conflict) errors and ensures the pods are all stopped before restarting.
  const totalWaitMs = 10 * 1000;
  const checkWaitMs = 100;
  for (let i = 0; i < totalWaitMs / checkWaitMs; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    if (specReplicas === await getStatusReplicas(name, namespace)) {
      // specified number of replicas matches status number of replicas
      return response;
    }
    // eslint-disable-next-line no-await-in-loop
    await new Promise(resolve => setTimeout(resolve, checkWaitMs));
  }

  return response;
}

async function restartDeployment(name, namespace) {
  logger.info('Restarting deployment: %s in namespace: %s', name, namespace);

  const initialSpecReplicas = await getSpecReplicas(name, namespace);
  if (initialSpecReplicas > 0) {
    await setSpecReplicas(name, namespace, 0);
  }
  const newSpecReplicas = initialSpecReplicas || 1;
  const response = await setSpecReplicas(name, namespace, newSpecReplicas);
  return response;
}

export default { getDeployment, createDeployment, deleteDeployment, updateDeployment, createOrUpdateDeployment, restartDeployment };
