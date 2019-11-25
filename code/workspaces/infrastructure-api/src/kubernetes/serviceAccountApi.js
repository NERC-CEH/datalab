import logger from '../config/logger';
import { getCoreV1Api } from './kubeConfig';

async function namespacedServiceAccountExists(name, namespace) {
  const k8sApi = getCoreV1Api();
  logger.info(`Checking serviceAccount ${name} exists in ${namespace}`);
  try {
    await k8sApi.readNamespacedServiceAccount(name, namespace);
    return true;
  } catch (error) {
    return false;
  }
}

/* eslint-disable consistent-return */
async function createNamespacedServiceAccount(name, namespace) {
  if (await namespacedServiceAccountExists(name, namespace)) {
    logger.info(`ServiceAccount ${name} already exists in namespace ${namespace}`);
    return true;
  }

  const k8sApi = getCoreV1Api();

  const serviceAccount = { metadata: { name } };
  try {
    logger.info(`Creating ServiceAccount: ${name} in namespace ${namespace}`);
    await k8sApi.createNamespacedServiceAccount(namespace, serviceAccount);
  } catch (error) {
    logger.error(
      `Error creating ServiceAccount ${name} in namespace ${namespace}: ${error.message}`,
    );
    throw error;
  }
}
/* eslint-disable consistent-return */

async function deleteNamespacedServiceAccount(name, namespace) {
  const k8sApi = getCoreV1Api();

  try {
    logger.info(`Deleting ServiceAccount: ${name} in namespace ${namespace}`);
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
