import logger from '../config/logger';
import { getCoreV1Api } from './kubeConfig';

async function createNamespacedServiceAccount(name, namespace) {
  const k8sApi = getCoreV1Api();

  const serviceAccount = { metadata: { name } };
  try {
    await k8sApi.createNamespacedServiceAccount(namespace, serviceAccount);
  } catch (error) {
    logger.error(
      `Error creating ServiceAccount ${name} in namespace ${namespace}: ${error.message}`,
    );
    throw error;
  }
}

async function deleteNamespacedServiceAccount(name, namespace) {
  const k8sApi = getCoreV1Api();

  try {
    await k8sApi.deleteNamespacedServiceAccount(name, namespace);
  } catch (error) {
    logger.error(`Error deleting ServiceAccount ${name} in namespace ${namespace}: ${error.message}`);
    throw error;
  }
}

export default {
  createNamespacedServiceAccount,
  deleteNamespacedServiceAccount,
};
