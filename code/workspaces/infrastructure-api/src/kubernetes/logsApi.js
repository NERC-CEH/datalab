import { getCoreV1Api } from './kubeConfig';
import logger from '../config/logger';

async function readNamespacedPodLog(namespaceName, podName) {
  const k8sApi = getCoreV1Api();

  try {
    const response = await k8sApi.readNamespacedPodLog(podName, namespaceName);

    return response.body;
  } catch (error) {
    logger.error(`Unable to retrieve pod logs for ${podName}: ${error}`);
    return null;
  }
}

export default {
  readNamespacedPodLog,
};
