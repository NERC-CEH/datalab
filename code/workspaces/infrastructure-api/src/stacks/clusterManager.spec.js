import clustersConfig from 'common/src/config/clusters';
import { defaultImage } from 'common/src/config/images';
import { createClusterStack, deleteClusterStack } from './clusterManager';
import * as stackBuilders from './stackBuilders';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import autoScalerApi from '../kubernetes/autoScalerApi';
import deploymentApi from '../kubernetes/deploymentApi';
import networkPolicyApi from '../kubernetes/networkPolicyApi';
import serviceApi from '../kubernetes/serviceApi';

jest.mock('./stackBuilders');
stackBuilders.createNetworkPolicy = jest.fn().mockReturnValue(() => {});
stackBuilders.createDeployment = jest.fn().mockReturnValue(() => {});
stackBuilders.createService = jest.fn().mockReturnValue(() => {});
stackBuilders.createAutoScaler = jest.fn().mockReturnValue(() => {});

jest.mock('../kubernetes/autoScalerApi');
autoScalerApi.deleteAutoScaler = jest.fn().mockResolvedValue();

jest.mock('../kubernetes/deploymentApi');
deploymentApi.deleteDeployment = jest.fn().mockResolvedValue();

jest.mock('../kubernetes/networkPolicyApi');
networkPolicyApi.deleteNetworkPolicy = jest.fn().mockResolvedValue();

jest.mock('../kubernetes/serviceApi');
serviceApi.deleteService = jest.fn().mockResolvedValue();

describe('clusterManager', () => {
  describe('createClusterStack', () => {
    it('creates expected resources', async () => {
      // Arrange
      const cluster = {
        type: 'DASK',
        volumeMount: 'volume-mount',
        condaPath: '/conda/path',
        maxWorkers: 8,
        maxWorkerMemoryGb: 4,
        maxWorkerCpu: 2,
        projectKey: 'project-key',
        name: 'cluster-name',
      };
      const clusterParams = {
        type: 'dask',
        projectKey: cluster.projectKey,
        volumeMount: cluster.volumeMount,
        condaPath: cluster.condaPath,
        pureDaskImage: defaultImage('dask').image,
        jupyterLabImage: defaultImage('jupyterlab').image,
        // scheduler
        schedulerPodLabel: 'dask-scheduler-cluster-name-po',
        schedulerMemory: `${clustersConfig().dask.scheduler.memoryMax_GB.default}Gi`,
        schedulerCpu: clustersConfig().dask.scheduler.CpuMax_vCPU.default,
        // workers
        workerPodLabel: 'dask-worker-cluster-name-po',
        schedulerServiceName: 'dask-scheduler-cluster-name',
        nThreads: clustersConfig().dask.workers.nThreads.default,
        deathTimeoutSec: clustersConfig().dask.workers.deathTimeout_sec.default,
        workerMemory: `${cluster.maxWorkerMemoryGb}Gi`,
        workerCpu: cluster.maxWorkerCpu,
        // auto-scaling
        maxReplicas: cluster.maxWorkers,
        targetCpuUtilization: clustersConfig().dask.workers.targetCpuUtilization_percent.default,
        targetMemoryUtilization: clustersConfig().dask.workers.targetMemoryUtilization_percent.default,
        scaleDownWindowSec: clustersConfig().dask.workers.scaleDownWindow_sec.default,
      };
      const schedulerParams = { ...clusterParams, name: 'scheduler-cluster-name' };
      const workerParams = { ...clusterParams, name: 'worker-cluster-name' };

      // Act
      await createClusterStack(cluster);

      // Asset
      expect(stackBuilders.createNetworkPolicy).toBeCalledWith(schedulerParams, deploymentGenerator.createDatalabDaskSchedulerNetworkPolicy);
      expect(stackBuilders.createDeployment).toHaveBeenNthCalledWith(1, schedulerParams, deploymentGenerator.createDatalabDaskSchedulerDeployment);
      expect(stackBuilders.createService).toBeCalledWith(schedulerParams, deploymentGenerator.createDatalabDaskSchedulerService);
      expect(stackBuilders.createDeployment).toHaveBeenNthCalledWith(2, workerParams, deploymentGenerator.createDatalabDaskWorkerDeployment);
      expect(stackBuilders.createAutoScaler).toBeCalledWith(workerParams, deploymentGenerator.createAutoScaler);
    });
  });

  describe('deleteClusterStack', () => {
    it('delete expected resources', async () => {
      // Arrange
      const cluster = {
        type: 'DASK',
        projectKey: 'project-key',
        name: 'cluster-name',
      };

      // Act
      await deleteClusterStack(cluster);

      // Asset
      expect(serviceApi.deleteService).toBeCalledWith('dask-scheduler-cluster-name', 'project-key');
      expect(autoScalerApi.deleteAutoScaler).toBeCalledWith('dask-worker-cluster-name-hpa', 'project-key');
      expect(deploymentApi.deleteDeployment).toHaveBeenNthCalledWith(1, 'dask-scheduler-cluster-name', 'project-key');
      expect(deploymentApi.deleteDeployment).toHaveBeenNthCalledWith(2, 'dask-worker-cluster-name', 'project-key');
      expect(networkPolicyApi.deleteNetworkPolicy).toBeCalledWith('dask-scheduler-cluster-name-netpol', 'project-key');
    });
  });
});
