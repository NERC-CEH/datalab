import KubeWatch from 'kube-watch';
import logger from 'winston';
import { find } from 'lodash';
import config from '../config/config';
import stackRepository from '../dataaccess/stacksRepository';
import { CREATING, READY } from '../models/stack.model';

const kubeApi = config.get('kubernetesApi');
const kubeNamespace = config.get('podNamespace');
const labelSelector = 'user-pod';
const events = ['added', 'modified', 'deleted'];

function kubeWatcher() {
  logger.info(`Starting kube-watcher, listening for pods labelled "${labelSelector}" on "${kubeNamespace}" namespace.`);

  return new KubeWatch('pods', {
    url: kubeApi,
    namespace: kubeNamespace,
    labelSelector,
    events,
  });
}

export function podAddedWatcher({ metadata: { labels } }) {
  const name = labels.name;
  const type = labels[labelSelector];

  logger.debug(`Pod added: -- name: "${name}", type: "${type}"`);

  return stackRepository.updateStatus({ name, type, status: CREATING })
    .then(() => logger.debug(`Updated status record for "${name}" to "${CREATING}"`));
}

export function podReadyWatcher(event) {
  const labels = event.metadata.labels;
  const name = labels.name;
  const type = labels[labelSelector];

  let output;

  if (event.status.phase === 'Running' && event.metadata.deletionTimestamp === undefined) {
    if (find(event.status.conditions, { type: 'Ready', status: 'True' })) {
      logger.debug(`Pod ready -- name: "${name}", type: "${type}"`);

      output = stackRepository.updateStatus({ name, type, status: READY })
        .then(() => logger.debug(`Updated status record for "${name}" to "${READY}"`));
    }
  }

  return output;
}

export function podDeletedWatcher({ metadata: { labels } }) {
  logger.debug(`Pod deleted -- name: "${labels.name}", type: "${labels[labelSelector]}"`);
}

export default kubeWatcher;
