import Promise from 'bluebird';
import logger from 'winston';
import podsApi from '../kubernetes/podsApi';
import stackRepository from '../dataaccess/stacksRepository';
import { parseKubeName } from './kubernetesHelpers';
import { READY, CREATING, UNAVAILABLE } from '../models/stack.model';

const kubeUpStatus = ['Running'];
const kubeCreateStatus = ['Pending', 'ContainerCreating', /^Init:/, 'PodInitializing'];

function statusChecker() {
  logger.info('Status checker: starting');

  return podsApi.getStacks()
    .then(groupStatusByName)
    .then(setStatus)
    .then(() => logger.info('Status checker: complete'));
}

const groupStatusByName = pods => pods
  .reduce((previous, { name, status }) => ({
    ...previous,
    [name]: previous[name] ? [...previous[name], status] : [status],
  }), {});

const setStatus = pods => Promise.mapSeries(Object.entries(pods), ([kubeName, statusArray]) => {
  const [type, name] = parseKubeName(kubeName);
  const status = getStatus(statusArray);

  return stackRepository.updateStatus({ name, type, status })
    .then(() => logger.debug(`Updated status record for "${name}" to "${status}"`));
});

const getStatus = (statusArray) => {
  if (arraysIncludes(statusArray, kubeUpStatus)) {
    return READY;
  } else if (arraysIncludes(statusArray, kubeCreateStatus)) {
    return CREATING;
  }

  return UNAVAILABLE;
};

const arraysIncludes = (current, expected) =>
  current.some(currentValue =>
    expected.some(expectedValue =>
      (currentValue.match(expectedValue) || []).length > 0));

export default statusChecker;
