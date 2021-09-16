import clustersConfig from 'common/src/config/clusters';
import { defaultImage } from 'common/src/config/images';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import { createDeployment, createService, createNetworkPolicy, createAutoScaler } from './stackBuilders';
import nameGenerator from '../common/nameGenerators';
import autoScalerApi from '../kubernetes/autoScalerApi';
import deploymentApi from '../kubernetes/deploymentApi';
import networkPolicyApi from '../kubernetes/networkPolicyApi';
import serviceApi from '../kubernetes/serviceApi';

// DASK -> dask; SPARK -> spark
const getLowerType = type => type.toLowerCase();

// distinguish between the scheduler and the worker deployments
const getSchedulerName = name => `scheduler-${name}`;
const getWorkerName = name => `worker-${name}`;

export const getSchedulerServiceName = (name, type) => nameGenerator.deploymentName(getSchedulerName(name), getLowerType(type));

export async function createClusterStack({ type, volumeMount, condaPath, maxWorkers, maxWorkerMemoryGb, maxWorkerCpu, projectKey, name }) {
  const lowerType = getLowerType(type);
  const schedulerName = getSchedulerName(name);
  const workerName = getWorkerName(name);

  // these are referenced in other resources
  const schedulerServiceName = getSchedulerServiceName(name, type);
  const schedulerPodLabel = nameGenerator.podLabel(schedulerName, lowerType);
  const workerPodLabel = nameGenerator.podLabel(workerName, lowerType);

  const clusterParams = {
    type: lowerType,
    projectKey,
    volumeMount,
    condaPath,
    pureDaskImage: defaultImage('dask').image,
    jupyterLabImage: defaultImage('jupyterlab').image,
    // scheduler
    schedulerPodLabel,
    schedulerMemory: `${clustersConfig().dask.scheduler.memoryMax_GB.default}Gi`,
    schedulerCpu: clustersConfig().dask.scheduler.CpuMax_vCPU.default,
    // workers
    workerPodLabel,
    schedulerServiceName,
    nThreads: clustersConfig().dask.workers.nThreads.default,
    deathTimeoutSec: clustersConfig().dask.workers.deathTimeout_sec.default,
    workerMemory: `${maxWorkerMemoryGb}Gi`,
    workerCpu: maxWorkerCpu,
    // auto-scaling
    maxReplicas: maxWorkers,
    targetCpuUtilization: clustersConfig().dask.workers.targetCpuUtilization_percent.default,
    targetMemoryUtilization: clustersConfig().dask.workers.targetMemoryUtilization_percent.default,
    scaleDownWindowSec: clustersConfig().dask.workers.scaleDownWindow_sec.default,
  };

  // distinguish between the scheduler and the worker deployments (and related resources)
  const schedulerParams = { ...clusterParams, name: schedulerName };
  const workerParams = { ...clusterParams, name: workerName };

  // create network policy first, for security
  await createNetworkPolicy(schedulerParams, deploymentGenerator.createDatalabDaskSchedulerNetworkPolicy)();

  // do the rest in parallel
  await Promise.all([
    createDeployment(schedulerParams, deploymentGenerator.createDatalabDaskSchedulerDeployment)(),
    createService(schedulerParams, deploymentGenerator.createDatalabDaskSchedulerService)(),
    createDeployment(workerParams, deploymentGenerator.createDatalabDaskWorkerDeployment)(),
    createAutoScaler(workerParams, deploymentGenerator.createAutoScaler)(),
  ]);
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
