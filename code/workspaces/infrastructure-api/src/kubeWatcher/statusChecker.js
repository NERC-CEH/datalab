import Promise from 'bluebird';
import { clusterList } from 'common/src/config/images';
import logger from '../config/logger';
import podsApi from '../kubernetes/podsApi';
import clustersRepository from '../dataaccess/clustersRepository';
import stackRepository from '../dataaccess/stacksRepository';
import { parseKubeName } from './kubernetesHelpers';
import { status as stackStatus } from '../models/stackEnums';
import { getStacksAndClustersDeployments } from '../kubernetes/deploymentApi';

const kubeUpStatus = ['Running'];
const kubeCreateStatus = ['ContainerCreating', /^Init:/, 'PodInitializing'];
const kubeRequestStatus = ['Pending'];
const kubeSuspendedStatus = [stackStatus.SUSPENDED];

const statusChecker = async () => {
  logger.debug('Status checker: starting');

  try {
    const stackPods = await podsApi.getStacksAndClusters();
    const stackDeployments = await getStacksAndClustersDeployments();

    // find scaled down deployments
    const missingPods = stackDeployments
      .filter(d => stackPods.findIndex(p => d.name === p.name) === -1)
      .map(d => ({
        ...d,
        status: d.replicas === 0 ? stackStatus.SUSPENDED : 'unknown',
      }));

    // pods still exist but the deployment has been scaled down
    const terminatingPods = stackDeployments
      .filter(d => stackPods.findIndex(p => d.name === p.name) > -1 && d.replicas === 0)
      .map(d => ({
        ...d,
        status: stackStatus.SUSPENDED,
      }));

    const stackPodsGroupedByName = groupStatusByName([...stackPods.sort((a, b) => a.creationTimestamp - b.creationTimestamp), ...missingPods, ...terminatingPods]);

    await setStatus(stackPodsGroupedByName);
    logger.debug('Status checker: complete');
  } catch (error) {
    logger.error(`Error getting stack status -> ${error}`);
  }
};

const groupStatusByName = pods => pods
  .reduce((previous, { name, namespace, status }) => {
    const entry = { kubeName: name, namespace, status: [status] };
    const key = `${name}-${namespace}`;
    if (previous[key]) {
      entry.status = [...entry.status, status];
    }

    return {
      ...previous,
      [key]: entry,
    };
  }, {});

export const getStatusUpdateFn = (type) => {
  if (clusterList().includes(type.toLowerCase())) {
    return clustersRepository.updateStatus;
  }

  return stackRepository.updateStatus;
};

const setStatus = pods => Promise.mapSeries(Object.values(pods), (podInfo) => {
  const { namespace, kubeName } = podInfo;
  const [type, name] = parseKubeName(kubeName);
  const status = getStatus(podInfo.status);

  const updateStatus = getStatusUpdateFn(type);

  return updateStatus({ name, namespace, type, status })
    .then((result) => {
      if (result.n === 0) {
        logger.warn(`Tried to update record for "${name}" in project "${namespace}" but no such record exists.`);
      } else {
        const message = `Updated status record for "${name}" in project "${namespace}" to "${status}"`;
        const loggingFn = result.nModified === 1 ? logger.info : logger.debug;
        loggingFn(message);
      }
    });
});

const getStatus = (statusArray) => {
  if (arraysIncludes(statusArray, kubeSuspendedStatus)) {
    return stackStatus.SUSPENDED;
  } if (arraysIncludes(statusArray, kubeUpStatus)) {
    return stackStatus.READY;
  } if (arraysIncludes(statusArray, kubeCreateStatus)) {
    return stackStatus.CREATING;
  } if (arraysIncludes(statusArray, kubeRequestStatus)) {
    return stackStatus.REQUESTED;
  }

  return stackStatus.UNAVAILABLE;
};

const arraysIncludes = (current, expected) => current.some(currentValue => expected.some(expectedValue => (currentValue.match(expectedValue) || []).length > 0));

export default statusChecker;
