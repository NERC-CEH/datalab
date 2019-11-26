import { loadYaml } from '@kubernetes/client-node';
import { getCoreV1Api } from './kubeConfig';
import logger from '../config/logger';

async function namespacedConfigMapExists(name, namespace) {
  const k8sApi = getCoreV1Api();

  try {
    await k8sApi.readNamespacedConfigMap(name, namespace);
    return true;
  } catch (error) {
    return false;
  }
}

async function createOrReplaceNamespacedConfigMap(name, namespace, manifest) {
  if (await namespacedConfigMapExists(name, namespace)) {
    return replaceNamespacedConfigMap(name, namespace, manifest);
  }
  return createNamespacedConfigMap(name, namespace, manifest);
}

async function createNamespacedConfigMap(name, namespace, manifest) {
  const k8sApi = getCoreV1Api();

  try {
    logger.info(`Creating configMap with name ${name} in namespace ${namespace} with manifest:`);
    logger.debug(manifest);
    const configMap = loadYaml(manifest);
    return k8sApi.createNamespacedConfigMap(namespace, configMap);
  } catch (error) {
    logger.error(`Error creating configMap with name ${name} in namespace ${namespace}`, error.response.body);
    throw error;
  }
}

async function replaceNamespacedConfigMap(name, namespace, manifest) {
  try {
    await deleteNamespacedConfigMap(name, namespace);
    await createNamespacedConfigMap(name, namespace, manifest);
  } catch (error) {
    throw error;
  }
}

async function deleteNamespacedConfigMap(name, namespace) {
  if (!(await namespacedConfigMapExists(name, namespace))) {
    logger.debug(`Config map ${name} does not exist in namespace ${namespace}, skipping deletion`);
    return;
  }
  const k8sApi = getCoreV1Api();

  try {
    logger.info(`Deleting configMap with name ${name} in namespace ${namespace}`);
    await k8sApi.deleteNamespacedConfigMap(name, namespace);
  } catch (error) {
    logger.error(`Error deleting configMap with name ${name} in namespace ${namespace}`, error.response.body);
    throw error;
  }
}

export default {
  namespacedConfigMapExists,
  createOrReplaceNamespacedConfigMap,
  createNamespacedConfigMap,
  replaceNamespacedConfigMap,
  deleteNamespacedConfigMap,
};
