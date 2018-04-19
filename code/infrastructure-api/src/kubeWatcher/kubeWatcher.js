import KubeWatch from 'kube-watch';
import logger from 'winston';
import { find } from 'lodash';
import config from '../config/config';
import stackRepository from '../dataaccess/stacksRepository';
import { getName } from './kubernetesHelpers';
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
  const kubeName = labels.name;
  const type = labels[SELECTOR_LABEL];
  const name = getName(kubeName);

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
  const labels = event.metadata.labels;
  const type = labels[SELECTOR_LABEL];
  const kubeName = labels.name;
  const name = getName(kubeName);

  let output = Promise.resolve();

  if (event.status.phase === 'Running' && event.metadata.deletionTimestamp === undefined) {
    if (find(event.status.conditions, { type: 'Ready', status: 'True' })) {
      logger.debug(`Pod ready -- name: "${kubeName}", type: "${type}"`);

      if (stackNames.includes(type)) {
        // Minio containers, like Stacks, are tagged with 'user-pod' but are not recorded in stacks DB. Only Stacks should
        // have their status updated.
        output = stackRepository.updateStatus({ name, type, status: READY })
          .then(() => logger.debug(`Updated status record for "${name}" to "${READY}"`));
      }
    }
  }

  return output;
}

export function podDeletedWatcher({ metadata: { labels } }) {
  logger.debug(`Pod deleted -- name: "${labels.name}", type: "${labels[SELECTOR_LABEL]}"`);
}

export default kubeWatcher;
