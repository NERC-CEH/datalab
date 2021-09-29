import axios from 'axios';
import { get } from 'lodash';
import { stackList } from 'common/src/config/images';
import config from '../config/config';
import { SELECTOR_LABEL } from '../stacks/StackConstants';

const API_BASE = config.get('kubernetesApi');
const PODS_URL = `${API_BASE}/api/v1/pods`;

function getPods() {
  return axios.get(PODS_URL, { params: { labelSelector: SELECTOR_LABEL } })
    .then(response => response.data)
    .then(handlePodlist);
}

async function getStacks() {
  const pods = await getPods();
  return pods.filter(({ type }) => stackList().includes(type));
}

async function getPodName(deploymentName, namespaceName) {
  const pods = await getPods();
  try {
    return pods.find(pod => pod.name === deploymentName && pod.namespace === namespaceName).podName;
  } catch (error) {
    return undefined;
  }
}

const handlePodlist = ({ items }) => items.map(pod => ({
  name: get(pod, 'metadata.labels.name'),
  namespace: get(pod, 'metadata.namespace'),
  type: get(pod, `metadata.labels.${SELECTOR_LABEL}`),
  status: handlePodStatus(pod),
  podName: get(pod, 'metadata.name'),
}));

const handlePodStatus = (pod) => {
  const containers = get(pod, 'status.containerStatuses', []);

  return getContainerStateReason(containers, 'terminated')
    || getContainerStateReason(containers, 'waiting')
    || get(pod, 'status.phase');
};

const getContainerStateReason = (containers, targetState) => {
  const filtered = containers.filter(container => get(container, `state.${targetState}`));
  if (filtered.length > 0) {
    return get(filtered[0], `state.${targetState}.reason`);
  }
  return undefined;
};

export default { getStacks, getPodName };
