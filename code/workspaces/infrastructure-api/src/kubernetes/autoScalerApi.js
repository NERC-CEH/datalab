import axios from 'axios';
import yaml from 'js-yaml';
import logger from '../config/logger';
import config from '../config/config';
import { handleCreateError, handleDeleteError } from './core';

const API_BASE = config.get('kubernetesApi');

const getAutoScalerUrl = (namespace, name) => {
  const nameComponent = name ? `/${name}` : '';
  return `${API_BASE}/apis/autoscaling/v2beta2/namespaces/${namespace}/horizontalpodautoscalers${nameComponent}`;
};

const YAML_CONTENT_HEADER = { headers: { 'Content-Type': 'application/yaml' } };

function createOrUpdateAutoScaler(name, namespace, manifest) {
  return getAutoScaler(name, namespace)
    .then(createOrReplace(name, namespace, manifest))
    .then(response => response.data);
}

const createOrReplace = (name, namespace, manifest) => (existingAutoScaler) => {
  if (existingAutoScaler) {
    return replaceAutoScaler(name, namespace, manifest);
  }

  return createAutoScaler(name, namespace, manifest);
};

function getAutoScaler(name, namespace) {
  return axios.get(getAutoScalerUrl(namespace, name))
    .then(response => response.data)
    .catch(() => undefined);
}

function createAutoScaler(name, namespace, manifest) {
  logger.info('Creating auto-scaler: %s in namespace %s', name, namespace);
  return axios.post(getAutoScalerUrl(namespace), manifest, YAML_CONTENT_HEADER)
    .catch(handleCreateError('auto-scaler', name));
}

function replaceAutoScaler(name, namespace, manifest) {
  logger.info('Replacing auto-scaler: %s in namespace %s', name, namespace);
  return deleteAutoScaler(name)
    .then(() => createAutoScaler(name, manifest));
}

function updateAutoScaler(name, namespace, manifest, existingAutoScaler) {
  logger.info('Updating auto-scaler: %s in namespace %s', name, namespace);
  const jsonManifest = copyRequiredFieldsToJsonManifest(manifest, existingAutoScaler);
  return axios.put(getAutoScalerUrl(namespace, name), jsonManifest)
    .catch(handleCreateError('auto-scaler', name));
}

function deleteAutoScaler(name, namespace) {
  logger.info('Deleting auto-scaler: %s in namespace %s', name, namespace);
  return axios.delete(`${getAutoScalerUrl(namespace, name)}`)
    .then(response => response.data)
    .catch(handleDeleteError('auto-scaler', name));
}

function copyRequiredFieldsToJsonManifest(manifest, existingAutoScaler) {
  const jsonManifest = yaml.load(manifest);
  jsonManifest.spec.clusterIP = existingAutoScaler.spec.clusterIP;
  jsonManifest.metadata.resourceVersion = existingAutoScaler.metadata.resourceVersion;
  return jsonManifest;
}

export default { getAutoScaler, createAutoScaler, updateAutoScaler, deleteAutoScaler, createOrUpdateAutoScaler };
