import logger from '../config/logger';
import { getRbacV1Api } from './kubeConfig';

async function namespacedRoleBindingExists(name, namespace) {
  const k8sApi = getRbacV1Api();
  logger.debug(`Checking roleBinding ${name} exists in ${namespace}`);
  try {
    await k8sApi.readNamespacedRoleBinding(name, namespace);
    return true;
  } catch (error) {
    return false;
  }
}

async function createNamespacedRoleBinding(bindingDefinition, namespace) {
  const k8sApi = getRbacV1Api();
  logger.debug(`RoleBinding being created with definition ${JSON.stringify(bindingDefinition)}`);

  try {
    await k8sApi.createNamespacedRoleBinding(namespace, bindingDefinition);
  } catch (error) {
    logger.error(
      `Error creating RoleBinding ${bindingDefinition.metadata.name} in namespace ${namespace}: ${JSON.stringify(error)}`,
    );
    throw error;
  }
}

async function deleteNamespacedRoleBinding(name, namespace) {
  if (!(await namespacedRoleBindingExists(name, namespace))) {
    logger.debug(`RoleBinding ${name} does not exist in namespace ${namespace}`);
    return;
  }
  const k8sApi = getRbacV1Api();

  try {
    await k8sApi.deleteNamespacedRoleBinding(name, namespace);
  } catch (error) {
    logger.error(
      `Error deleting RoleBinding ${name} in namespace ${namespace}: ${error.message}`,
    );
    throw error;
  }
}

export default {
  createNamespacedRoleBinding,
  deleteNamespacedRoleBinding,
};
