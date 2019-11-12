import nameGenerators from '../common/nameGenerators';
import roleBindingApi from './roleBindingApi';
import serviceAccountApi from './serviceAccountApi';

async function createProjectComputeRBAC(projectKey) {
  await serviceAccountApi.createNamespacedServiceAccount(
    nameGenerators.computeSubmissionServiceAccount(projectKey),
    projectKey,
  );

  const roleBindingDefinition = {
    metadata: {
      name: nameGenerators.computeSubmissionServiceAccountRoleBinding(projectKey),
    },
    roleRef: {
      kind: 'ClusterRole',
      name: nameGenerators.computeSubmissionClusterRole(),
      apiGroup: 'rbac.authorization.k8s.io',
    },
    subjects: [{
      kind: 'ServiceAccount',
      name: nameGenerators.computeSubmissionServiceAccount(projectKey),
      namespace: projectKey,
    }],
  };
  await roleBindingApi.createNamespacedRoleBinding(
    roleBindingDefinition,
    nameGenerators.projectComputeNamespace(projectKey),
  );
}

async function deleteProjectComputeRBAC(projectKey) {
  await serviceAccountApi.deleteNamespacedServiceAccount(
    nameGenerators.computeSubmissionServiceAccount(projectKey),
    projectKey,
  );

  await roleBindingApi.deleteNamespacedRoleBinding(
    nameGenerators.computeSubmissionServiceAccountRoleBinding(projectKey),
    nameGenerators.projectComputeNamespace(projectKey),
  );
}

export default {
  createProjectComputeRBAC,
  deleteProjectComputeRBAC,
};
