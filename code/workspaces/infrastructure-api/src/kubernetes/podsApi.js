import axios from 'axios';
import { get } from 'lodash';
import config from '../config/config';
import { STACKS, SELECTOR_LABEL } from '../stacks/Stacks';

const stackNames = Object.values(STACKS).map(stack => stack.name);

const API_BASE = config.get('kubernetesApi');
const NAMESPACE = config.get('podNamespace');

const PODS_URL = `${API_BASE}/api/v1/namespaces/${NAMESPACE}/pods`;

function getPods() {
  return axios.get(PODS_URL, { params: { labelSelector: SELECTOR_LABEL } })
    .then(response => response.data)
    .then(handlePodlist);
}

function getStacks() {
  return getPods()
    .then(pods => pods.filter(({ type }) => stackNames.includes(type)));
}

const handlePodlist = ({ items }) => items.map(pod => ({
  name: get(pod, 'metadata.labels.name'),
  type: get(pod, `metadata.labels.${SELECTOR_LABEL}`),
  status: get(pod, 'status.phase'),
}));

export default { getPods, getStacks };
