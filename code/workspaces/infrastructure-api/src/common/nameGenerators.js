const generateDeploymentName = (name, type) => `${type}-${name}`;
const pvcName = volumeName => `${volumeName}-claim`;

// project namespaces
const projectNamespace = projectKey => projectKey;
const projectComputeNamespace = projectKey => `${projectKey}-compute`;

// Compute submission
const computeSubmissionServiceAccount = projectKey => `${projectKey}-compute-submission-account`;
const computeSubmissionServiceAccountRoleBinding = projectKey => `${computeSubmissionServiceAccount(projectKey)}-role-binding`;
const computeSubmissionClusterRole = () => 'compute-submission-role';

// Spark
const pySparkConfigMap = deploymentName => `${deploymentName}-pyspark-config`;
const sparkDriverHeadlessService = deploymentServiceName => `${deploymentServiceName}-spark-driver-headless-service`;
const sparkJob = deploymentName => `${deploymentName}-spark-job`;

export default {
  deploymentName: generateDeploymentName,
  computeSubmissionClusterRole,
  computeSubmissionServiceAccount,
  computeSubmissionServiceAccountRoleBinding,
  projectNamespace,
  projectComputeNamespace,
  pvcName,
  pySparkConfigMap,
  sparkDriverHeadlessService,
  sparkJob,
};
