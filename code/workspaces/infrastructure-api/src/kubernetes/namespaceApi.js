import get from 'lodash/get';
import { getCoreV1Api } from './kubeConfig';
import logger from '../config/logger';

export const MANAGED_BY = 'datalabs';

async function readNamespaceMetadata(namespaceName) {
  const k8sApi = getCoreV1Api();

  try {
    const response = await k8sApi.readNamespace(namespaceName);
    const managedBy = get(response, 'body.metadata.labels.managedBy', undefined);
    const managed = managedBy === MANAGED_BY;

    return { namespace: namespaceName, exists: true, managed };
  } catch (error) {
    logger.debug(error);
    return { namespace: namespaceName, exists: false, managed: false };
  }
}

async function idempotentCreateNamespace(namespaceName) {
  const k8sApi = getCoreV1Api();

  // Namespace creation throws an error if the namespace exists so to ensure
  // this is an idempotent operation We return early if the namespace exists
  const namespaceMetadata = await readNamespaceMetadata(namespaceName);
  if (namespaceMetadata.exists) {
    return;
  }

  const namespace = {
    metadata: {
      name: namespaceName,
      labels: {
        name: namespaceName,
        managedBy: MANAGED_BY,
      },
    },
  };

  try {
    logger.debug(`Creating Namespace: ${namespaceName}`);
    await k8sApi.createNamespace(namespace);
  } catch (error) {
    logger.error('Unable to create Namespace', error.response.body);
    throw error;
  }
}

async function idempotentDeleteNamespace(namespaceName) {
  const k8sApi = getCoreV1Api();

  // Namespace deletion throws an error if the namespace does not exist so to ensure
  // this is an idempotent operation We return early if the namespace does not exist
  const namespaceMetadata = await readNamespaceMetadata(namespaceName);
  if (!namespaceMetadata.exists) {
    return;
  }

  try {
    logger.debug(`Deleting Namespace: ${namespaceName}`);
    await k8sApi.deleteNamespace(namespaceName);
  } catch (error) {
    logger.error('Unable to delete Namespace', error.response.body);
    throw error;
  }
}

export default {
  readNamespaceMetadata,
  idempotentCreateNamespace,
  idempotentDeleteNamespace,
};
