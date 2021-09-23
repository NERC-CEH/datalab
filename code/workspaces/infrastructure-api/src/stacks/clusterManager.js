import clustersConfig from 'common/src/config/clusters';
import { defaultImage } from 'common/src/config/images';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import { createDeployment, createService, createNetworkPolicy, createAutoScaler } from './stackBuilders';
import nameGenerator from '../common/nameGenerators';
import autoScalerApi from '../kubernetes/autoScalerApi';
import deploymentApi from '../kubernetes/deploymentApi';
import networkPolicyApi from '../kubernetes/networkPolicyApi';
import serviceApi from '../kubernetes/serviceApi';
import { mountAssetsOnDeployment } from './assets/assetManager';

// DASK -> dask; SPARK -> spark
const getLowerType = type => type.toLowerCase();

// distinguish between the scheduler and the worker deployments
const getSchedulerName = name => `scheduler-${name}`;
const getWorkerName = name => `worker-${name}`;

export const getSchedulerServiceName = (name, type) => nameGenerator.deploymentName(getSchedulerName(name), getLowerType(type));

export const getSchedulerAddress = (schedulerServiceName, type) => {
  const lowerType = getLowerType(type);
  if (lowerType === 'dask') {
    return `tcp://${schedulerServiceName}:8786`;
  }

  if (lowerType === 'spark') {
    return `spark://${schedulerServiceName}:7077`;
  }

  return '';
};

export const getComponentCreators = (type) => {
  const lowerType = getLowerType(type);
  if (lowerType === 'dask') {
    return {
      networkPolicyCreator: deploymentGenerator.createDatalabDaskSchedulerNetworkPolicy,
      schedulerDeploymentCreator: deploymentGenerator.createDatalabDaskSchedulerDeployment,
      schedulerServiceCreator: deploymentGenerator.createDatalabDaskSchedulerService,
      workerDeploymentCreator: deploymentGenerator.createDatalabDaskWorkerDeployment,
    };
  }

  if (lowerType === 'spark') {
    return {
      networkPolicyCreator: deploymentGenerator.createDatalabSparkSchedulerNetworkPolicy,
      schedulerDeploymentCreator: deploymentGenerator.createDatalabSparkSchedulerDeployment,
      schedulerServiceCreator: deploymentGenerator.createDatalabSparkSchedulerService,
      workerDeploymentCreator: deploymentGenerator.createDatalabSparkWorkerDeployment,
    };
  }

  throw new Error(`Unsupported cluster type ${type}`);
};

export async function createClusterStack({ type, volumeMount, condaPath, maxWorkers, maxWorkerMemoryGb, maxWorkerCpu, projectKey, name, assetIds }) {
  const lowerType = getLowerType(type);
  const schedulerName = getSchedulerName(name);
  const workerName = getWorkerName(name);

  // these are referenced in other resources
  const schedulerServiceName = getSchedulerServiceName(name, type);
  const schedulerPodLabel = nameGenerator.podLabel(schedulerName, lowerType);
  const workerPodLabel = nameGenerator.podLabel(workerName, lowerType);
  const schedulerContainerName = nameGenerator.schedulerContainerName(lowerType);
  const workerContainerName = nameGenerator.workerContainerName(lowerType);

  const clusterParams = {
    type: lowerType,
    projectKey,
    volumeMount,
    condaPath,
    clusterImage: defaultImage(lowerType).image,
    jupyterLabImage: defaultImage('jupyterlab').image,
    // scheduler
    schedulerPodLabel,
    schedulerContainerName,
    schedulerMemory: `${clustersConfig()[lowerType].scheduler.memoryMax_GB.default}Gi`,
    schedulerCpu: clustersConfig()[lowerType].scheduler.CpuMax_vCPU.default,
    // workers
    workerPodLabel,
    workerContainerName,
    schedulerServiceName,
    nThreads: clustersConfig()[lowerType].workers.nThreads.default,
    deathTimeoutSec: clustersConfig()[lowerType].workers.deathTimeout_sec.default,
    workerMemory: `${maxWorkerMemoryGb}Gi`,
    workerCpu: maxWorkerCpu,
    // auto-scaling
    maxReplicas: maxWorkers,
    targetCpuUtilization: clustersConfig()[lowerType].workers.targetCpuUtilization_percent.default,
    targetMemoryUtilization: clustersConfig()[lowerType].workers.targetMemoryUtilization_percent.default,
    scaleDownWindowSec: clustersConfig()[lowerType].workers.scaleDownWindow_sec.default,
  };

  // distinguish between the scheduler and the worker deployments (and related resources)
  const schedulerParams = { ...clusterParams, name: schedulerName };
  const workerParams = { ...clusterParams, name: workerName };

  const {
    networkPolicyCreator,
    schedulerDeploymentCreator,
    schedulerServiceCreator,
    workerDeploymentCreator,
  } = getComponentCreators(lowerType);

  // create network policy first, for security
  await createNetworkPolicy(schedulerParams, networkPolicyCreator)();

  // do the rest in parallel
  await Promise.all([
    createDeployment(schedulerParams, schedulerDeploymentCreator)(),
    createService(schedulerParams, schedulerServiceCreator)(),
    createDeployment(workerParams, workerDeploymentCreator)(),
    createAutoScaler(workerParams, deploymentGenerator.createAutoScaler)(),
  ]);

  // mount assets on the deployments
  if (assetIds.length > 0) {
    const schedulerDeploymentName = nameGenerator.deploymentName(schedulerName, lowerType);
    const workerDeploymentName = nameGenerator.deploymentName(workerName, lowerType);
    await Promise.all([
      mountAssetsOnDeployment({ projectKey, deploymentName: schedulerDeploymentName, containerNameWithMounts: schedulerContainerName, assetIds }),
      mountAssetsOnDeployment({ projectKey, deploymentName: workerDeploymentName, containerNameWithMounts: workerContainerName, assetIds }),
    ]);
  }
}

export async function deleteClusterStack({ type, projectKey, name }) {
  const lowerType = getLowerType(type);
  const schedulerName = getSchedulerName(name);
  const workerName = getWorkerName(name);

  const workerAutoScalerK8sName = nameGenerator.autoScalerName(workerName, lowerType);
  const workerDeploymentK8sName = nameGenerator.deploymentName(workerName, lowerType);
  const schedulerServiceK8sName = getSchedulerServiceName(name, type);
  const schedulerDeploymentK8sName = nameGenerator.deploymentName(schedulerName, lowerType);
  const schedulerNetworkPolicyK8sName = nameGenerator.networkPolicyName(schedulerName, lowerType);

  // do these in parallel
  await Promise.all([
    serviceApi.deleteService(schedulerServiceK8sName, projectKey),
    autoScalerApi.deleteAutoScaler(workerAutoScalerK8sName, projectKey),
    deploymentApi.deleteDeployment(schedulerDeploymentK8sName, projectKey),
    deploymentApi.deleteDeployment(workerDeploymentK8sName, projectKey),
  ]);

  // delete network policy last, for security
  await networkPolicyApi.deleteNetworkPolicy(schedulerNetworkPolicyK8sName, projectKey);
}
