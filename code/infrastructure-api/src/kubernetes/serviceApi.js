import axios from 'axios';
import yaml from 'js-yaml';
import config from '../config/config';

const API_BASE = config.get('kubernetesApi');
const NAMESPACE = config.get('podNamespace');

const SERVICE_URL = `${API_BASE}/api/v1/namespaces/${NAMESPACE}/services`;

const YAML_CONTENT_HEADER = { headers: { 'Content-Type': 'application/yaml' } };

function createOrUpdateService(name, manifest) {
  return getService(name)
    .then(createOrReplace(name, manifest))
    .then(response => response.data);
}

const createOrReplace = (name, manifest) => (existingService) => {
  if (existingService) {
    return updateService(name, manifest, existingService);
  }

  return createService(manifest);
};

function getService(name) {
  return axios.get(`${SERVICE_URL}/${name}`)
    .then(response => response.data)
    .catch(() => undefined);
}

function createService(manifest) {
  return axios.post(SERVICE_URL, manifest, YAML_CONTENT_HEADER)
    .catch(handleError);
}

function updateService(name, manifest, existingService) {
  const jsonManifest = copyRequiredFieldsToJsonManfiest(manifest, existingService);
  return axios.put(`${SERVICE_URL}/${name}`, jsonManifest)
    .catch(handleError);
}

function copyRequiredFieldsToJsonManfiest(manifest, existingService) {
  const jsonManifest = yaml.load(manifest);
  jsonManifest.spec.clusterIP = existingService.spec.clusterIP;
  jsonManifest.metadata.resourceVersion = existingService.metadata.resourceVersion;
  return jsonManifest;
}

function handleError(error) {
  throw new Error(`Unable to create kubernetes service ${error.response.data.message}`);
}

export default { getService, createService, updateService, createOrUpdateService };
