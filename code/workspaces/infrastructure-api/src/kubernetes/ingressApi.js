import axios from 'axios';
import logger from '../config/logger';
import config from '../config/config';
import { handleCreateError, handleDeleteError, handlePatchError } from './core';

const API_BASE = config.get('kubernetesApi');

const getIngressUrl = (namespace, name) => {
  const nameComponent = name ? `/${name}` : '';
  return `${API_BASE}/apis/networking.k8s.io/v1beta1/namespaces/${namespace}/ingresses${nameComponent}`;
};

const YAML_CONTENT_HEADER = { headers: { 'Content-Type': 'application/yaml' } };

const PATCH_CONTENT_HEADER = { headers: { 'Content-Type': 'application/merge-patch+json' } };

function createOrUpdateIngress(name, namespace, manifest) {
  return getIngress(name, namespace)
    .then(createOrReplace(name, namespace, manifest));
}

const createOrReplace = (name, namespace, manifest) => (existingIngress) => {
  if (existingIngress) {
    return updateIngress(name, namespace, manifest);
  }

  return createIngress(name, namespace, manifest);
};

function getIngress(name, namespace) {
  return axios.get(getIngressUrl(namespace, name))
    .then(response => response.data)
    .catch(() => undefined);
}

function createIngress(name, namespace, manifest) {
  logger.info('Creating ingress: %s in namespace %s', name, namespace);
  return axios.post(getIngressUrl(namespace), manifest, YAML_CONTENT_HEADER)
    .catch(handleCreateError('ingress', name));
}

function updateIngress(name, namespace, manifest) {
  logger.info('Updating ingress: %s in namespace %s', name, namespace);
  return axios.put(getIngressUrl(namespace, name), manifest, YAML_CONTENT_HEADER)
    .catch(handleCreateError('ingress', name));
}

async function patchIngress(name, namespace, patchBody) {
  logger.info(`Patching ingress ${name} in namespace ${namespace}`);
  try {
    return await axios.patch(
      getIngressUrl(namespace, name),
      patchBody,
      PATCH_CONTENT_HEADER,
    );
  } catch (error) {
    return handlePatchError('ingress', name)(error);
  }
}

function deleteIngress(name, namespace) {
  logger.info('Deleting ingress: %s in namespace %s', name, namespace);
  return axios.delete(getIngressUrl(namespace, name))
    .then(response => response.data)
    .catch(handleDeleteError('ingress', name));
}

export default { getIngress, createIngress, deleteIngress, updateIngress, patchIngress, createOrUpdateIngress };
