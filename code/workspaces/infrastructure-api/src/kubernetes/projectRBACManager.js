import roleBindingApi from './roleBindingApi';
import serviceAccountApi from './serviceAccountApi';

const getProjectComputeNamespace = projectKey => `${projectKey}-compute`;
const getComputeSubmissionServiceAccountName = projectKey => `${projectKey}-compute-submission-account`;
const getComputeSubmissionServiceAccountRoleBindingName = projectKey => `${getComputeSubmissionServiceAccountName(projectKey)}-role-binding`;
const getComputeSubmissionClusterRoleName = () => 'compute-submission-role';

async function createProjectComputeRBAC(projectKey) {
  await serviceAccountApi.createNamespacedServiceAccount(
    getComputeSubmissionServiceAccountName(projectKey),
    projectKey,
  );

  const roleBindingDefinition = {
    metadata: {
      name: getComputeSubmissionServiceAccountRoleBindingName(projectKey),
    },
    roleRef: {
      kind: 'ClusterRole',
      name: getComputeSubmissionClusterRoleName(),
      apiGroup: 'rbac.authorization.k8s.io',
    },
    subjects: [{
      kind: 'ServiceAccount',
      name: getComputeSubmissionServiceAccountName(projectKey),
      namespace: projectKey,
    }],
  };
  await roleBindingApi.createNamespacedRoleBinding(
    roleBindingDefinition,
    getProjectComputeNamespace(projectKey),
  );
}

async function deleteProjectComputeRBAC(projectKey) {
  await serviceAccountApi.deleteNamespacedServiceAccount(
    getComputeSubmissionServiceAccountName(projectKey),
    projectKey,
  );

  await roleBindingApi.deleteNamespacedRoleBinding(
    getComputeSubmissionServiceAccountRoleBindingName(projectKey),
    getProjectComputeNamespace(projectKey),
  );
}

export default {
  createProjectComputeRBAC,
  deleteProjectComputeRBAC,
};
