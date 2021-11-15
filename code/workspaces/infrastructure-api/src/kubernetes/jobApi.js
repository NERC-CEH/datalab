import axios from 'axios';
import logger from '../config/logger';
import config from '../config/config';
import { handleCreateError } from './core';

const API_BASE = config.get('kubernetesApi');

const getJobUrl = (namespace, name) => {
  const nameComponent = name ? `/${name}` : '';
  return `${API_BASE}/apis/batch/v1/namespaces/${namespace}/jobs${nameComponent}`;
};

const YAML_CONTENT_HEADER = { headers: { 'Content-Type': 'application/yaml' } };

const createJob = async (name, namespace, manifest) => {
  logger.info('Creating job: %s in namespace: %s', name, namespace);

  try {
    return await axios.post(getJobUrl(namespace), manifest, YAML_CONTENT_HEADER);
  } catch (e) {
    return handleCreateError('job', name)(e);
  }
};

export default {
  createJob,
};
