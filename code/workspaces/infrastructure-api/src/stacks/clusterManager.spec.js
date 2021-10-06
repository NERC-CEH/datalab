import clustersConfig from 'common/src/config/clusters';
import { defaultImage } from 'common/src/config/images';
import { createClusterStack, deleteClusterStack, getSchedulerAddress, scaleDownClusterExec, scaleUpClusterExec } from './clusterManager';
import * as stackBuilders from './stackBuilders';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import autoScalerApi from '../kubernetes/autoScalerApi';
import deploymentApi from '../kubernetes/deploymentApi';
import networkPolicyApi from '../kubernetes/networkPolicyApi';
import serviceApi from '../kubernetes/serviceApi';
import { mountAssetsOnDeployment } from './assets/assetManager';
import stackStatusChecker from '../kubeWatcher/stackStatusChecker';

jest.mock('./stackBuilders');
stackBuilders.createNetworkPolicy = jest.fn().mockReturnValue(() => {});
stackBuilders.createDeployment = jest.fn().mockReturnValue(() => {});
stackBuilders.createService = jest.fn().mockReturnValue(() => {});
stackBuilders.createAutoScaler = jest.fn().mockReturnValue(() => {});

jest.mock('../kubernetes/autoScalerApi');
autoScalerApi.deleteAutoScaler = jest.fn().mockResolvedValue();

jest.mock('../kubernetes/deploymentApi');
deploymentApi.deleteDeployment = jest.fn().mockResolvedValue();
deploymentApi.scaleDownDeployment = jest.fn();
deploymentApi.scaleUpDeployment = jest.fn();

jest.mock('../kubernetes/networkPolicyApi');
networkPolicyApi.deleteNetworkPolicy = jest.fn().mockResolvedValue();

jest.mock('../kubernetes/serviceApi');
serviceApi.deleteService = jest.fn().mockResolvedValue();

jest.mock('./assets/assetManager', () => ({
  mountAssetsOnDeployment: jest.fn().mockResolvedValue(),
}));

jest.mock('../kubeWatcher/stackStatusChecker');

describe('clusterManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSchedulerAddress', () => {
    const scheduler = 'scheduler';

    it('returns the correct dask address', () => {
      expect(getSchedulerAddress(scheduler, 'DASK')).toEqual('tcp://scheduler:8786');
    });

    it('returns the correct spark address', () => {
      expect(getSchedulerAddress(scheduler, 'SPARK')).toEqual('spark://scheduler:7077');
    });

    it('returns an empty address for an invalid type', () => {
      expect(getSchedulerAddress(scheduler, 'invalid')).toEqual('');
    });
  });

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
        assetIds: ['1234', '5678'],
      };
      const clusterParams = {
        type: 'dask',
        clusterName: 'DASK-cluster-name',
        projectKey: cluster.projectKey,
        volumeMount: cluster.volumeMount,
        condaPath: cluster.condaPath,
        clusterImage: defaultImage('dask').image,
        jupyterLabImage: defaultImage('jupyterlab').image,
        // scheduler
        schedulerPodLabel: 'dask-scheduler-cluster-name-po',
        schedulerContainerName: 'dask-scheduler-cont',
        schedulerMemory: `${clustersConfig().dask.scheduler.memoryMax_GB.default}Gi`,
        schedulerCpu: clustersConfig().dask.scheduler.CpuMax_vCPU.default,
        // workers
        workerPodLabel: 'dask-worker-cluster-name-po',
        workerContainerName: 'dask-worker-cont',
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

      expect(mountAssetsOnDeployment).toBeCalledWith({
        projectKey: 'project-key',
        deploymentName: 'dask-scheduler-cluster-name',
        containerNameWithMounts: 'dask-scheduler-cont',
        assetIds: cluster.assetIds,
      });

      expect(mountAssetsOnDeployment).toBeCalledWith({
        projectKey: 'project-key',
        deploymentName: 'dask-worker-cluster-name',
        containerNameWithMounts: 'dask-worker-cont',
        assetIds: cluster.assetIds,
      });
    });

    it('creates spark cluster correctly', async () => {
      // Arrange
      const cluster = {
        type: 'SPARK',
        volumeMount: 'volume-mount',
        condaPath: '/conda/path',
        maxWorkers: 8,
        maxWorkerMemoryGb: 4,
        maxWorkerCpu: 2,
        projectKey: 'project-key',
        name: 'cluster-name',
        assetIds: ['1234', '5678'],
      };
      const clusterParams = {
        type: 'spark',
        clusterName: 'SPARK-cluster-name',
        projectKey: cluster.projectKey,
        volumeMount: cluster.volumeMount,
        condaPath: cluster.condaPath,
        clusterImage: defaultImage('spark').image,
        jupyterLabImage: defaultImage('jupyterlab').image,
        // scheduler
        schedulerPodLabel: 'spark-scheduler-cluster-name-po',
        schedulerContainerName: 'spark-scheduler-cont',
        schedulerMemory: `${clustersConfig().spark.scheduler.memoryMax_GB.default}Gi`,
        schedulerCpu: clustersConfig().spark.scheduler.CpuMax_vCPU.default,
        // workers
        workerPodLabel: 'spark-worker-cluster-name-po',
        workerContainerName: 'spark-worker-cont',
        schedulerServiceName: 'spark-scheduler-cluster-name',
        nThreads: clustersConfig().spark.workers.nThreads.default,
        deathTimeoutSec: clustersConfig().spark.workers.deathTimeout_sec.default,
        workerMemory: `${cluster.maxWorkerMemoryGb}Gi`,
        workerCpu: cluster.maxWorkerCpu,
        // auto-scaling
        maxReplicas: cluster.maxWorkers,
        targetCpuUtilization: clustersConfig().spark.workers.targetCpuUtilization_percent.default,
        targetMemoryUtilization: clustersConfig().spark.workers.targetMemoryUtilization_percent.default,
        scaleDownWindowSec: clustersConfig().spark.workers.scaleDownWindow_sec.default,
      };
      const schedulerParams = { ...clusterParams, name: 'scheduler-cluster-name' };
      const workerParams = { ...clusterParams, name: 'worker-cluster-name' };

      // Act
      await createClusterStack(cluster);

      // Asset
      expect(stackBuilders.createNetworkPolicy).toBeCalledWith(schedulerParams, deploymentGenerator.createDatalabSparkSchedulerNetworkPolicy);
      expect(stackBuilders.createDeployment).toHaveBeenNthCalledWith(1, schedulerParams, deploymentGenerator.createDatalabSparkSchedulerDeployment);
      expect(stackBuilders.createService).toBeCalledWith(schedulerParams, deploymentGenerator.createDatalabSparkSchedulerService);
      expect(stackBuilders.createDeployment).toHaveBeenNthCalledWith(2, workerParams, deploymentGenerator.createDatalabSparkWorkerDeployment);
      expect(stackBuilders.createAutoScaler).toBeCalledWith(workerParams, deploymentGenerator.createAutoScaler);

      expect(mountAssetsOnDeployment).toBeCalledWith({
        projectKey: 'project-key',
        deploymentName: 'spark-scheduler-cluster-name',
        containerNameWithMounts: 'spark-scheduler-cont',
        assetIds: cluster.assetIds,
      });

      expect(mountAssetsOnDeployment).toBeCalledWith({
        projectKey: 'project-key',
        deploymentName: 'spark-worker-cluster-name',
        containerNameWithMounts: 'spark-worker-cont',
        assetIds: cluster.assetIds,
      });
    });

    it('creates expected resources without assets', async () => {
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
        assetIds: [],
      };
      const clusterParams = {
        type: 'dask',
        clusterName: 'DASK-cluster-name',
        projectKey: cluster.projectKey,
        volumeMount: cluster.volumeMount,
        condaPath: cluster.condaPath,
        clusterImage: defaultImage('dask').image,
        jupyterLabImage: defaultImage('jupyterlab').image,
        // scheduler
        schedulerPodLabel: 'dask-scheduler-cluster-name-po',
        schedulerContainerName: 'dask-scheduler-cont',
        schedulerMemory: `${clustersConfig().dask.scheduler.memoryMax_GB.default}Gi`,
        schedulerCpu: clustersConfig().dask.scheduler.CpuMax_vCPU.default,
        // workers
        workerPodLabel: 'dask-worker-cluster-name-po',
        workerContainerName: 'dask-worker-cont',
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

      expect(mountAssetsOnDeployment).not.toHaveBeenCalled();
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

  describe('scaleDownClusterExec', () => {
    it('scales a cluster down', async () => {
      const okMessage = { message: 'OK' };
      deploymentApi.scaleDownDeployment.mockResolvedValue(okMessage);
      const cluster = {
        type: 'DASK',
        projectKey: 'project-key',
        name: 'cluster-name',
      };
      const expectedResponse = [okMessage, okMessage];

      const response = await scaleDownClusterExec(cluster);

      expect(response).toEqual(expectedResponse);
      expect(deploymentApi.scaleDownDeployment).toHaveBeenCalledTimes(2);
      expect(deploymentApi.scaleDownDeployment).toHaveBeenCalledWith('dask-scheduler-cluster-name', 'project-key');
      expect(deploymentApi.scaleDownDeployment).toHaveBeenCalledWith('dask-worker-cluster-name', 'project-key');
      expect(stackStatusChecker).toHaveBeenCalledTimes(1);
    });
  });

  describe('scaleUpClusterExec', () => {
    it('scales a cluster up', async () => {
      const okMessage = { message: 'OK' };
      deploymentApi.scaleUpDeployment.mockResolvedValue(okMessage);
      const cluster = {
        type: 'DASK',
        projectKey: 'project-key',
        name: 'cluster-name',
      };
      const expectedResponse = [okMessage, okMessage];

      const response = await scaleUpClusterExec(cluster);

      expect(response).toEqual(expectedResponse);
      expect(deploymentApi.scaleUpDeployment).toHaveBeenCalledTimes(2);
      expect(deploymentApi.scaleUpDeployment).toHaveBeenCalledWith('dask-scheduler-cluster-name', 'project-key');
      expect(deploymentApi.scaleUpDeployment).toHaveBeenCalledWith('dask-worker-cluster-name', 'project-key');
      expect(stackStatusChecker).toHaveBeenCalledTimes(1);
    });
  });
});
