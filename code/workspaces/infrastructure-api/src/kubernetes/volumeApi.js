import axios from 'axios';
import { has, get } from 'lodash';
import logger from '../config/logger';
import config from '../config/config';
import { handleCreateError, handleDeleteError } from './core';

const API_BASE = config.get('kubernetesApi');

const getPVCUrl = (namespace, name) => {
  const nameComponent = name ? `/${name}` : '';
  return `${API_BASE}/api/v1/namespaces/${namespace}/persistentvolumeclaims${nameComponent}`;
};

const YAML_CONTENT_HEADER = { headers: { 'Content-Type': 'application/yaml' } };

function createOrUpdatePersistentVolumeClaim(name, namespace, manifest) {
  return getPersistentVolumeClaim(name, namespace)
    .then(createOrReplace(name, namespace, manifest));
}

const createOrReplace = (name, namespace, manifest) => (existingPersistentVolumeClaim) => {
  if (existingPersistentVolumeClaim) {
    return updatePersistentVolumeClaim(name, namespace, manifest);
  }

  return createPersistentVolumeClaim(name, namespace, manifest);
};

function getPersistentVolumeClaim(name, namespace) {
  return axios.get(getPVCUrl(namespace, name))
    .then(response => response.data)
    .catch(() => undefined);
}

function createPersistentVolumeClaim(name, namespace, manifest) {
  logger.info('Creating persistent volume claim: %s in namespace %s', name, namespace);
  return axios.post(getPVCUrl(namespace), manifest, YAML_CONTENT_HEADER)
    .catch(handleCreateError('persistent volume claim', name));
}

function updatePersistentVolumeClaim(name, namespace, manifest) {
  logger.info('Updating persistent volume claim: %s in namespace %s', name, namespace);
  return axios.put(getPVCUrl(namespace, name), manifest, YAML_CONTENT_HEADER)
    .catch(handleCreateError('persistent volume claim', name));
}

function deletePersistentVolumeClaim(name, namespace) {
  logger.info('Deleting persistent volume claim: %s in namespace %s', name, namespace);
  return axios.delete(getPVCUrl(namespace, name))
    .then(response => response.data)
    .catch(handleDeleteError('persistent volume claim', name));
}

function queryPersistentVolumeClaim(name, namespace) {
  logger.info('Getting volume claim: %s in namespace %s', name, namespace);
  return getPersistentVolumeClaim(name, namespace)
    .then(processVolumeDetails)
    .catch(() => {});
}

function processVolumeDetails(volume) {
  let name;

  if (has(volume, 'metadata.name')) {
    name = get(volume, 'metadata.name').replace('-claim', '');
  }

  return {
    name,
    storageType: get(volume, 'metadata.annotations["volume.beta.kubernetes.io/storage-class"]'),
    capacityTotal: get(volume, 'spec.resources.requests.storage'),
  };
}

export default {
  getPersistentVolumeClaim,
  createPersistentVolumeClaim,
  deletePersistentVolumeClaim,
  updatePersistentVolumeClaim,
  createOrUpdatePersistentVolumeClaim,
  queryPersistentVolumeClaim,
};
