import * as k8s from '@kubernetes/client-node';
import { find } from 'lodash';
import { stackAndClusterList } from 'common/src/config/images';
import logger from '../config/logger';
import kubeConfig from '../kubernetes/kubeConfig';
import { parsePodLabels } from './kubernetesHelpers';
import { status } from '../models/stackEnums';
import { SELECTOR_LABEL } from '../stacks/StackConstants';
import { getStatusUpdateFn } from './statusChecker';

const watchUrl = '/api/v1/pods';
const selector = { labelSelector: SELECTOR_LABEL };

function startKubeWatcher() {
  try {
    kubeWatcher();
  } catch (error) {
    throw new Error(`Error starting Kube Watcher -> ${error}`);
  }
}

function kubeWatcher() {
  logger.info(`Starting kube-watcher, listening for pods labelled "${SELECTOR_LABEL}" on any namespace.`);
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
  if (error) {
    logger.error(`kubeWatcher error -> ${error} -> Exiting process...`);
    return process.exit(1);
  }

  logger.warn('kubeWatcher connection lost -> Restarting watcher...');
  return startKubeWatcher();
}

export function podAddedWatcher(event) {
  const { kubeName, name, type } = parsePodLabels(event.metadata.labels);

  logger.debug(`Pod added: -- name: "${kubeName}", type: "${type}"`);

  let output = Promise.resolve();

  if (stackAndClusterList().includes(type.toLowerCase()) && !isPodRunning(event)) {
    // Minio containers, like Stacks, are tagged with 'user-pod' but are not recorded in stacks DB. Only Stacks and clusters should
    // have their status updated.
    // Additionally ensure that pod is not already running as JS Kubernetes Client
    // issues ADDED events for all current pods on startup by default
    const updateStatus = getStatusUpdateFn(type);
    output = updateStatus({ name, type, status: status.CREATING })
      .then(() => logger.info(`Updated status record for "${kubeName}" to "${status.CREATING}"`));
  }

  return output;
}

export function podReadyWatcher(event) {
  const { kubeName, name, type } = parsePodLabels(event.metadata.labels);

  let output = Promise.resolve();

  if (isPodRunning(event) && stackAndClusterList().includes(type)) {
    // Minio containers, like Stacks, are tagged with 'user-pod' but are not recorded in stacks DB. Only Stacks and clusters should
    // have their status updated.
    logger.debug(`Pod ready -- name: "${kubeName}", type: "${type}"`);

    const updateStatus = getStatusUpdateFn(type);
    output = updateStatus({ name, type, status: status.READY })
      .then(() => logger.info(`Updated status record for "${name}" to "${status.READY}"`));
  }

  return output;
}

export function podDeletedWatcher({ metadata: { labels } }) {
  logger.debug(`Pod deleted -- name: "${labels.name}", type: "${labels[SELECTOR_LABEL]}"`);
}

const isPodRunning = event => event.status.phase === 'Running'
  && event.metadata.deletionTimestamp === undefined
  && find(event.status.conditions, { type: 'Ready', status: 'True' });

export default startKubeWatcher;
