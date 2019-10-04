import axios from 'axios';
import yaml from 'js-yaml';
import logger from '../config/logger';
import config from '../config/config';
import { handleCreateError, handleDeleteError } from './core';

const API_BASE = config.get('kubernetesApi');

const getServiceUrl = (namespace, name) => {
  const nameComponent = name ? `/${name}` : '';
  return `${API_BASE}/api/v1/namespaces/${namespace}/services${nameComponent}`;
};

const YAML_CONTENT_HEADER = { headers: { 'Content-Type': 'application/yaml' } };

function createOrUpdateService(name, namespace, manifest) {
  return getService(name, namespace)
    .then(createOrReplace(name, namespace, manifest))
    .then(response => response.data);
}

const createOrReplace = (name, namespace, manifest) => (existingService) => {
  if (existingService) {
    return replaceService(name, namespace, manifest);
  }

  return createService(name, namespace, manifest);
};

function getService(name, namespace) {
  return axios.get(`${getServiceUrl(namespace)}/${name}`)
    .then(response => response.data)
    .catch(() => undefined);
}

function createService(name, namespace, manifest) {
  logger.info('Creating service: %s in namespace %s', name, namespace);
  return axios.post(getServiceUrl(namespace), manifest, YAML_CONTENT_HEADER)
    .catch(handleCreateError('service', name));
}

function replaceService(name, namespace, manifest) {
  logger.info('Replacing service: %s in namespace %s', name, namespace);
  return deleteService(name)
    .then(() => createService(name, manifest));
}

function updateService(name, namespace, manifest, existingService) {
  logger.info('Updating service: %s in namespace %s', name, namespace);
  const jsonManifest = copyRequiredFieldsToJsonManfiest(manifest, existingService);
  return axios.put(`${getServiceUrl(namespace, name)}`, jsonManifest)
    .catch(handleCreateError('service', name));
}

function deleteService(name, namespace) {
  logger.info('Deleting service: %s in namespace %s', name, namespace);
  return axios.delete(`${getServiceUrl(namespace, name)}`)
    .then(response => response.data)
    .catch(handleDeleteError('service', name));
}

function copyRequiredFieldsToJsonManfiest(manifest, existingService) {
  const jsonManifest = yaml.load(manifest);
  jsonManifest.spec.clusterIP = existingService.spec.clusterIP;
  jsonManifest.metadata.resourceVersion = existingService.metadata.resourceVersion;
  return jsonManifest;
}

export default { getService, createService, updateService, deleteService, createOrUpdateService };
