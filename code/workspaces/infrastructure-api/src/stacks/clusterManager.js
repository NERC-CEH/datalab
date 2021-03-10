import clustersConfig from 'common/src/config/clusters';
import { defaultImage } from 'common/src/config/images';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import { createDeployment, createService, createNetworkPolicy, createAutoScaler } from './stackBuilders';
import nameGenerator from '../common/nameGenerators';

async function createClusterStack({ type, volumeMount, condaPath, maxWorkers, maxWorkerMemoryGb, maxWorkerCpu, projectKey, name }) {
  const lowerType = type.toLowerCase();
  const networkPolicyName = nameGenerator.networkPolicyName(name, lowerType);
  const schedulerPodLabel = nameGenerator.schedulerPodLabel(name);
  const clusterParams = {
    type: lowerType,
    name, // TODO remove this
    projectKey,
    volumeMount,
    condaPath,
    pureDaskImage: defaultImage('dask').image,
    jupyterLabImage: defaultImage('jupyterlab').image,
    workerMemory: `${maxWorkerMemoryGb}Gi`,
    workerCpu: maxWorkerCpu,
    schedulerPodLabel,
    schedulerMemory: `${clustersConfig().dask.scheduler.memoryMax_GB.default}Gi`,
    schedulerCpu: clustersConfig().dask.scheduler.CpuMax_vCPU.default,
    nThreads: clustersConfig().dask.workers.nThreads.default,
    deathTimeoutSec: clustersConfig().dask.workers.deathTimeout_sec.default,
    maxReplicas: maxWorkers,
    targetCpuUtilization: clustersConfig().dask.workers.targetCpuUtilization_percent.default,
    targetMemoryUtilization: clustersConfig().dask.workers.targetMemoryUtilization_percent.default,
    scaleDownWindowSec: clustersConfig().dask.workers.scaleDownWindow_sec.default,
  };
  // TODO - have params for each type, so name is full name for each
  const networkPolicyParams = { ...clusterParams, name: networkPolicyName };

  // create network policy first for security
  await createNetworkPolicy(networkPolicyParams, deploymentGenerator.createDatalabDaskSchedulerNetworkPolicy)();

  // do the rest in parallel
  await Promise.all([
    createDeployment(clusterParams, deploymentGenerator.createDatalabDaskWorkerDeployment)(),
    createService(clusterParams, deploymentGenerator.createDatalabDaskSchedulerService)(),
    createDeployment(clusterParams, deploymentGenerator.createDatalabDaskSchedulerDeployment)(),
    createAutoScaler(clusterParams, deploymentGenerator.createAutoScaler)(),
  ]);
}

export { createClusterStack }; // eslint-disable-line import/prefer-default-export
