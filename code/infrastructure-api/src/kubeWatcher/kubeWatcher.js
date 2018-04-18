import KubeWatch from 'kube-watch';
import logger from 'winston';
import { find } from 'lodash';
import config from '../config/config';
import stackRepository from '../dataaccess/stacksRepository';
import { CREATING, READY } from '../models/stack.model';
import { SELECTOR_LABEL } from '../stacks/Stacks';

const kubeApi = config.get('kubernetesApi');
const kubeNamespace = config.get('podNamespace');
const events = ['added', 'modified', 'deleted'];

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
  const name = labels.name;
  const type = labels[SELECTOR_LABEL];

  logger.debug(`Pod added: -- name: "${name}", type: "${type}"`);

  return stackRepository.updateStatus({ name, type, status: CREATING })
    .then(() => logger.debug(`Updated status record for "${name}" to "${CREATING}"`));
}

export function podReadyWatcher(event) {
  const labels = event.metadata.labels;
  const type = labels[SELECTOR_LABEL];
  const name = String(labels.name).replace(`${type}-`, '');

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
  logger.debug(`Pod deleted -- name: "${labels.name}", type: "${labels[SELECTOR_LABEL]}"`);
}

export default kubeWatcher;
