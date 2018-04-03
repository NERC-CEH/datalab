import KubeWatch from 'kube-watch';
import logger from 'winston';
import { find } from 'lodash';
import config from '../config/config';

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

export function podAddedWatcher() {
  logger.debug('Pod added');
}

export function podReadyWatcher(event) {
  if (event.status.phase === 'Running' && event.metadata.deletionTimestamp === undefined) {
    if (find(event.status.conditions, { type: 'Ready', status: 'True' })) {
      logger.debug('Pod ready');
    }
  }
}

export function podDeletedWatcher() {
  logger.debug('Pod deleted');
}

export default kubeWatcher;
