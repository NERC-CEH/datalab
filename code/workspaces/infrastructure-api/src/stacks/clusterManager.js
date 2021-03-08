import clustersConfig from 'common/src/config/clusters';
import { defaultImage } from 'common/src/config/images';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import { createDeployment } from './stackBuilders';

const type = 'datalab-dask';

async function createClusterStack(params) {
  const deploymentParams = {
    ...params,
    type,
    pureDaskImage: defaultImage('dask').image,
    jupyterLabImage: defaultImage('jupyterlab').image,
    schedulerMemory: `${clustersConfig().dask.scheduler.memoryMax_GB.default}Gi`,
    schedulerCpu: `${clustersConfig().dask.scheduler.CpuMax_vCPU.default}`,
  };
  await createDeployment(deploymentParams, deploymentGenerator.createDatalabDaskSchedulerDeployment)();
}

export { createClusterStack }; // eslint-disable-line import/prefer-default-export
