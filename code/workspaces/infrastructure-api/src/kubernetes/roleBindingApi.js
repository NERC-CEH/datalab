import logger from '../config/logger';
import { getRbacV1Api } from './kubeConfig';

async function createNamespacedRoleBinding(bindingDefinition, namespace) {
  const k8sApi = getRbacV1Api();

  try {
    await k8sApi.createNamespacedRoleBinding(namespace, bindingDefinition);
  } catch (error) {
    logger.error(
      `Error creating RoleBinding ${bindingDefinition.metadata.name} in namespace ${namespace}: ${error.message}`,
    );
    throw error;
  }
}

async function deleteNamespacedRoleBinding(name, namespace) {
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
