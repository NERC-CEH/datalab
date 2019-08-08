import * as k8s from '@kubernetes/client-node';
import { find } from 'lodash';
import logger from '../config/logger';
import config from '../config/config';
import kubeConfig from '../kubernetes/kubeConfig';
import stackRepository from '../dataaccess/stacksRepository';
import { parsePodLabels } from './kubernetesHelpers';
import { CREATING, READY } from '../models/stack.model';
import { STACKS, SELECTOR_LABEL } from '../stacks/Stacks';

const kubeNamespace = config.get('podNamespace');
const stackNames = Object.values(STACKS).map(stack => stack.name);
const watchUrl = `/api/v1/namespaces/${kubeNamespace}/pods`;
const selector = { labelSelector: SELECTOR_LABEL };

function kubeWatcher() {
  logger.info(`Starting kube-watcher, listening for pods labelled "${SELECTOR_LABEL}" on "${kubeNamespace}" namespace.`);
  return new k8s.Watch(kubeConfig).watch(watchUrl, selector, eventHandler, errorHandler);
}

function eventHandler(type, obj) {
  if (type === 'ADDED') {
    podAddedWatcher(obj);
  } else if (type === 'MODIFIED') {
    podReadyWatcher(obj);
  } else if (type === 'DELETED') {
    podDeletedWatcher(obj);
  } else {
    logger.info(`Unknown watcher event type: ${type}`);
  }
}

function errorHandler(error) {
  // If lose connection to k8s then get error but no attempt to reconnect. This
  // function forces exit with non-zero code so k8s will restart container as a way of
  // reconnecting.
  logger.error(`kubeWatcher error -> ${error} -> Exiting process...`);
  process.exit(1);
}

export function podAddedWatcher({ metadata: { labels } }) {
  const { kubeName, name, type } = parsePodLabels(labels);

  logger.debug(`Pod added: -- name: "${kubeName}", type: "${type}"`);

  let output = Promise.resolve();

  if (stackNames.includes(type)) {
    // Minio containers, like Stacks, are tagged with 'user-pod' but are not recorded in stacks DB. Only Stacks should
    // have their status updated.
    output = stackRepository.updateStatus({ name, type, status: CREATING })
      .then(() => logger.info(`Updated status record for "${kubeName}" to "${CREATING}"`));
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
      .then(() => logger.info(`Updated status record for "${name}" to "${READY}"`));
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
