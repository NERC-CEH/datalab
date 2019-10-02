import Promise from 'bluebird';
import logger from '../config/logger';
import podsApi from '../kubernetes/podsApi';
import stackRepository from '../dataaccess/stacksRepository';
import { parseKubeName } from './kubernetesHelpers';
import { READY, CREATING, REQUESTED, UNAVAILABLE } from '../models/stack.model';

const kubeUpStatus = ['Running'];
const kubeCreateStatus = ['ContainerCreating', /^Init:/, 'PodInitializing'];
const kubeRequestStatus = ['Pending'];

function statusChecker() {
  logger.debug('Status checker: starting');

  return podsApi.getStacks()
    .then(groupStatusByName)
    .then(setStatus)
    .then(() => logger.debug('Status checker: complete'))
    .catch(error => logger.error(`Error getting stack status -> ${error}`));
}

const groupStatusByName = pods => pods
  .reduce((previous, { name, namespace, status }) => {
    const entry = { namespace, status: [status] };
    if (previous[name]) {
      entry.status = [...entry.status, status];
    }

    return {
      ...previous,
      [name]: entry,
    };
  }, {});

const setStatus = pods => Promise.mapSeries(Object.entries(pods), ([kubeName, podInfo]) => {
  const [type, name] = parseKubeName(kubeName);
  const status = getStatus(podInfo.status);
  const { namespace } = podInfo;

  return stackRepository.updateStatus({ name, namespace, type, status })
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
  if (arraysIncludes(statusArray, kubeUpStatus)) {
    return READY;
  } if (arraysIncludes(statusArray, kubeCreateStatus)) {
    return CREATING;
  } if (arraysIncludes(statusArray, kubeRequestStatus)) {
    return REQUESTED;
  }

  return UNAVAILABLE;
};

const arraysIncludes = (current, expected) => current.some(currentValue => expected.some(expectedValue => (currentValue.match(expectedValue) || []).length > 0));

export default statusChecker;
