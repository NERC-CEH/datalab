import axios from 'axios';
import logger from 'winston';
import config from '../config/config';
import { handleCreateError, handleDeleteError } from './core';

const API_BASE = config.get('kubernetesApi');
const NAMESPACE = config.get('podNamespace');

const PVC_URL = `${API_BASE}/api/v1/namespaces/${NAMESPACE}/persistentvolumeclaims`;

const YAML_CONTENT_HEADER = { headers: { 'Content-Type': 'application/yaml' } };

function createOrUpdatePersistentVolumeClaim(name, manifest) {
  return getPersistentVolumeClaim(name, manifest)
    .then(createOrReplace(name, manifest));
}

const createOrReplace = (name, manifest) => (existingPersistentVolumeClaim) => {
  if (existingPersistentVolumeClaim) {
    return updatePersistentVolumeClaim(name, manifest);
  }

  return createPersistentVolumeClaim(name, manifest);
};

function getPersistentVolumeClaim(name) {
  return axios.get(`${PVC_URL}/${name}`)
    .then(response => response.data)
    .catch(() => undefined);
}

function createPersistentVolumeClaim(name, manifest) {
  logger.info('Creating persistent volume claim: %s', name);
  return axios.post(PVC_URL, manifest, YAML_CONTENT_HEADER)
    .catch(handleCreateError);
}

function updatePersistentVolumeClaim(name, manifest) {
  logger.info('Updating persistent volume claim: %s', name);
  return axios.put(`${PVC_URL}/${name}`, manifest, YAML_CONTENT_HEADER)
    .catch(handleCreateError);
}

function deletePersistentVolumeClaim(name) {
  logger.info('Deleting persistent volume claim: %s', name);
  return axios.delete(`${PVC_URL}/${name}`)
    .then(response => response.data)
    .catch(handleDeleteError('persistent volume claim', name));
}

export default {
  getPersistentVolumeClaim,
  createPersistentVolumeClaim,
  deletePersistentVolumeClaim,
  updatePersistentVolumeClaim,
  createOrUpdatePersistentVolumeClaim,
};
