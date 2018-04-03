import KubeWatch from 'kube-watch';
import logger from 'winston';
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

export default kubeWatcher;
