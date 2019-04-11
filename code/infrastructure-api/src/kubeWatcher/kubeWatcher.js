import * as k8s from '@kubernetes/client-node';
import logger from 'winston';
import { find } from 'lodash';
import config from '../config/config';
import stackRepository from '../dataaccess/stacksRepository';
import { parsePodLabels } from './kubernetesHelpers';
import { CREATING, READY } from '../models/stack.model';
import { STACKS, SELECTOR_LABEL } from '../stacks/Stacks';

const kubeApi = config.get('kubernetesApi');
const kubeNamespace = config.get('podNamespace');
const stackNames = Object.values(STACKS).map(stack => stack.name);
const kc = new k8s.KubeConfig();
const cluster = {
  name: 'default-cluster',
  server: kubeApi,
};
const user = {
  name: 'default-auth',
};
const context = {
  name: 'default-context',
  user: user.name,
  cluster: cluster.name,
  namespace: kubeNamespace,
};

function kubeWatcher() {
  logger.info(`Starting kube-watcher, listening for pods labelled "${SELECTOR_LABEL}" on "${kubeNamespace}" namespace.`);

  kc.loadFromOptions({
    clusters: [cluster],
    users: [user],
    contexts: [context],
    currentContext: context.name,
  });

  const watch = new k8s.Watch(kc);
  return watch.watch(`/api/v1/namespaces/${kubeNamespace}/pods`, { labelSelector: 'user-pod' },
    (type, obj) => {
      if (type === 'ADDED') {
        podAddedWatcher(obj);
      } else if (type === 'MODIFIED') {
        podReadyWatcher(obj);
      } else if (type === 'DELETED') {
        podDeletedWatcher(obj);
      } else {
        logger.info(`Unknown type: ${type}`);
      }
    },
    (err) => {
      logger.error(err);
    });
}

export function podAddedWatcher(event) {
  const { kubeName, name, type } = parsePodLabels(event.metadata.labels);
  let output = Promise.resolve();

  if (stackNames.includes(type) && isPodPending(event)) {
    logger.debug(`Pod added: -- name: "${kubeName}", type: "${type}"`);
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

const isPodRunning = event => event.status.phase === 'Running'
  && event.metadata.deletionTimestamp === undefined
  && find(event.status.conditions, { type: 'Ready', status: 'True' });

const isPodPending = event => event.status.phase === 'Pending'
  && event.metadata.deletionTimestamp === undefined;

export default kubeWatcher;
