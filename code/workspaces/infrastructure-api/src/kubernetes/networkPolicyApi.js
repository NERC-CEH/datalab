import axios from 'axios';
import yaml from 'js-yaml';
import logger from '../config/logger';
import config from '../config/config';
import { handleCreateError, handleDeleteError } from './core';

const API_BASE = config.get('kubernetesApi');

const getNetworkPolicyUrl = (namespace, name) => {
  const nameComponent = name ? `/${name}` : '';
  return `${API_BASE}/apis/networking.k8s.io/v1/namespaces/${namespace}/networkpolicies${nameComponent}`;
};

const YAML_CONTENT_HEADER = { headers: { 'Content-Type': 'application/yaml' } };

function createOrUpdateNetworkPolicy(name, namespace, manifest) {
  return getNetworkPolicy(name, namespace)
    .then(createOrReplace(name, namespace, manifest))
    .then(response => response.data);
}

const createOrReplace = (name, namespace, manifest) => (existingNetworkPolicy) => {
  if (existingNetworkPolicy) {
    return replaceNetworkPolicy(name, namespace, manifest);
  }

  return createNetworkPolicy(name, namespace, manifest);
};

function getNetworkPolicy(name, namespace) {
  return axios.get(getNetworkPolicyUrl(namespace, name))
    .then(response => response.data)
    .catch(() => undefined);
}

function createNetworkPolicy(name, namespace, manifest) {
  logger.info('Creating network policy: %s in namespace %s', name, namespace);
  return axios.post(getNetworkPolicyUrl(namespace), manifest, YAML_CONTENT_HEADER)
    .catch(handleCreateError('network policy', name));
}

function replaceNetworkPolicy(name, namespace, manifest) {
  logger.info('Replacing network policy: %s in namespace %s', name, namespace);
  return deleteNetworkPolicy(name)
    .then(() => createNetworkPolicy(name, manifest));
}

function updateNetworkPolicy(name, namespace, manifest, existingNetworkPolicy) {
  logger.info('Updating network policy: %s in namespace %s', name, namespace);
  const jsonManifest = copyRequiredFieldsToJsonManifest(manifest, existingNetworkPolicy);
  return axios.put(getNetworkPolicyUrl(namespace, name), jsonManifest)
    .catch(handleCreateError('network policy', name));
}

function deleteNetworkPolicy(name, namespace) {
  logger.info('Deleting network policy: %s in namespace %s', name, namespace);
  return axios.delete(`${getNetworkPolicyUrl(namespace, name)}`)
    .then(response => response.data)
    .catch(handleDeleteError('network policy', name));
}

function copyRequiredFieldsToJsonManifest(manifest, existingNetworkPolicy) {
  const jsonManifest = yaml.load(manifest);
  jsonManifest.spec.clusterIP = existingNetworkPolicy.spec.clusterIP;
  jsonManifest.metadata.resourceVersion = existingNetworkPolicy.metadata.resourceVersion;
  return jsonManifest;
}

export default { getNetworkPolicy, createNetworkPolicy, updateNetworkPolicy, deleteNetworkPolicy, createOrUpdateNetworkPolicy };
