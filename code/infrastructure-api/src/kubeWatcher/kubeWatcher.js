import KubeWatch from 'kube-watch';
import logger from 'winston';
import { find } from 'lodash';
import config from '../config/config';
import stackRepository from '../dataaccess/stacksRepository';
import { parsePodLabels } from './kubernetesHelpers';
import { CREATING, READY } from '../models/stack.model';
import { STACKS, SELECTOR_LABEL } from '../stacks/Stacks';

const kubeApi = config.get('kubernetesApi');
const kubeNamespace = config.get('podNamespace');
const events = ['added', 'modified', 'deleted'];
const stackNames = Object.values(STACKS).map(stack => stack.name);

function kubeWatcher() {
  logger.info(`Starting kube-watcher, listening for pods labelled "${SELECTOR_LABEL}" on "${kubeNamespace}" namespace.`);

  return new KubeWatch('pods', {
    url: kubeApi,
    namespace: kubeNamespace,
    labelSelector: SELECTOR_LABEL,
    events,
  });
}

export function podAddedWatcher({ metadata: { labels } }) {
  const { kubeName, name, type } = parsePodLabels(labels);

  logger.debug(`Pod added: -- name: "${kubeName}", type: "${type}"`);

  let output = Promise.resolve();

  if (stackNames.includes(type)) {
    // Minio containers, like Stacks, are tagged with 'user-pod' but are not recorded in stacks DB. Only Stacks should
    // have their status updated.
    output = stackRepository.updateStatus({ name, type, status: CREATING })
      .then(() => logger.debug(`Updated status record for "${kubeName}" to "${CREATING}"`));
  }

  return output;
}

export function podReadyWatcher(event) {
  const { kubeName, name, type } = parsePodLabels(event.metadata.labels);

  let output = Promise.resolve();

  if (isPodRunning(event) && stackNames.includes(type)) {
    // Minio containers, like Stacks, are tagged with 'user-pod' but are not recorded in stacks DB. Only Stacks should
    // have their status updated.
    logger.debug(`Pod ready -- name: "${kubeName}", type: "${type}"`);

    output = stackRepository.updateStatus({ name, type, status: READY })
      .then(() => logger.debug(`Updated status record for "${name}" to "${READY}"`));
  }

  return output;
}

export function podDeletedWatcher({ metadata: { labels } }) {
  logger.debug(`Pod deleted -- name: "${labels.name}", type: "${labels[SELECTOR_LABEL]}"`);
}

const isPodRunning = event =>
  event.status.phase === 'Running' &&
  event.metadata.deletionTimestamp === undefined &&
  find(event.status.conditions, { type: 'Ready', status: 'True' });

export default kubeWatcher;
