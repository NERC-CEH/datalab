import clustersConfig from 'common/src/config/clusters';
import { defaultImage } from 'common/src/config/images';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import { createDeployment, createService, createNetworkPolicy, createAutoScaler } from './stackBuilders';

const daskType = 'datalab-dask';

async function createClusterStack({ volumeMount, condaPath, maxWorkers, maxWorkerMemoryGb, maxWorkerCpu, projectKey, name }) {
  const clusterParams = {
    type: daskType,
    projectKey,
    name,
    volumeMount,
    condaPath,
    maxWorkers,
    workerMemory: `${maxWorkerMemoryGb}Gi`,
    workerCpu: maxWorkerCpu,
    pureDaskImage: defaultImage('dask').image,
    jupyterLabImage: defaultImage('jupyterlab').image,
    schedulerMemory: `${clustersConfig().dask.scheduler.memoryMax_GB.default}Gi`,
    schedulerCpu: clustersConfig().dask.scheduler.CpuMax_vCPU.default,
    nThreads: clustersConfig().dask.workers.nThreads.default,
    deathTimeoutSec: clustersConfig().dask.workers.deathTimeout_sec.default,
    cpuUtilization: clustersConfig().dask.workers.targetCpuUtilization_percent.default,
    memoryUtilization: clustersConfig().dask.workers.targetMemoryUtilization_percent.default,
    scaleDownWindowSec: clustersConfig().dask.workers.scaleDownWindow_sec.default,
  };
  await createNetworkPolicy(clusterParams, deploymentGenerator.createDatalabDaskSchedulerNetworkPolicy)();
  await createDeployment(clusterParams, deploymentGenerator.createDatalabDaskWorkerDeployment)();
  await createService(clusterParams, deploymentGenerator.createDatalabDaskSchedulerService)();
  await createDeployment(clusterParams, deploymentGenerator.createDatalabDaskSchedulerDeployment)();
  await createAutoScaler(clusterParams, deploymentGenerator.createDatalabDaskWorkerAutoScaler)();
}

export { createClusterStack }; // eslint-disable-line import/prefer-default-export
