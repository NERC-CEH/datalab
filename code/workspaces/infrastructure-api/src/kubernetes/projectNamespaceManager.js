import namespaceApi from './namespaceApi';

const computeNamespaceName = projectKey => `${projectKey}-compute`;

/**
 * Create namespaces required by project
 * @param projectKey the project key
 * @returns {Promise<void>}
 */
async function idempotentCreateProjectNamespaces(projectKey) {
  await namespaceApi.idempotentCreateNamespace(projectKey);
  await namespaceApi.idempotentCreateNamespace(computeNamespaceName(projectKey));
}

/**
 * Delete the project namespaces
 * @param projectKey
 * @returns {Promise<void>}
 */
async function idempotentDeleteProjectNamespaces(projectKey) {
  await namespaceApi.idempotentDeleteNamespace(projectKey);
  await namespaceApi.idempotentDeleteNamespace(computeNamespaceName(projectKey));
}

/**
 * Check if project requires a forbidden namespace
 * @param projectKey the project key
 * @returns {Promise<void>}
 */
async function checkForbiddenNamespaces(projectKey) {
  const projectNamespace = await namespaceApi.readNamespaceMetadata(projectKey);
  const projectComputeNamespace = await namespaceApi.readNamespaceMetadata(computeNamespaceName(projectKey));

  return (isNamespaceForbidden(projectNamespace) || isNamespaceForbidden(projectComputeNamespace));
}

/**
 * Check if namespace is forbidden.
 * A namespace is forbidden it exists and is not managed by datalabs
 * @param namespaceInfo
 */
function isNamespaceForbidden(namespaceInfo) {
  return !!(namespaceInfo.exists && !namespaceInfo.managed);
}

export default {
  checkForbiddenNamespaces,
  idempotentCreateProjectNamespaces,
  idempotentDeleteProjectNamespaces,
};
