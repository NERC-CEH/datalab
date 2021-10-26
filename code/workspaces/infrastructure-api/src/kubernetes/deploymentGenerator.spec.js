import { stackTypes } from 'common';
import deploymentGenerator from './deploymentGenerator';
import config from '../config/config';

jest.mock('../config/config');
const origConfig = jest.requireActual('../config/config');
config.get = jest.fn().mockImplementation(s => origConfig.default.default(s));

describe('deploymentGenerator', () => {
  describe('createDatalabDaskSchedulerDeployment', () => {
    const params = {
      deploymentName: 'deployment-name',
      clusterName: 'DASK-deployment-name',
      type: 'dask',
      clusterImage: 'dask-image',
      jupyterLabImage: 'lab-image',
      schedulerPodLabel: 'scheduler-pod-label',
      schedulerContainerName: 'dask-scheduler-cont',
      schedulerMemory: 'scheduler-memory',
      schedulerCpu: 'scheduler-cpu',
    };
    it('uses dask image if no volumeMount/condaPath set', async () => {
      const manifest = await deploymentGenerator.createDatalabDaskSchedulerDeployment(params);
      expect(manifest).toMatchSnapshot();
    });

    it('uses jupyter image if volumeMount/condaPath set', async () => {
      const manifest = await deploymentGenerator.createDatalabDaskSchedulerDeployment({
        ...params,
        volumeMount: 'volume-mount',
        condaPath: '/data/conda/some-env',
      });
      expect(manifest).toMatchSnapshot();
    });
  });

  describe('createDatalabDaskWorkerDeployment', () => {
    const params = {
      deploymentName: 'deployment-name',
      clusterImage: 'dask-image',
      jupyterLabImage: 'lab-image',
      workerPodLabel: 'worker-pod-label',
      workerContainerName: 'dask-worker-cont',
      workerMemory: 'worker-memory',
      workerCpu: 'worker-cpu',
      nThreads: 'n-threads',
      deathTimeoutSec: 'death-timeout-sec',
      schedulerServiceName: 'scheduler-service-name',
    };
    it('uses dask image if no volumeMount/condaPath set', async () => {
      const manifest = await deploymentGenerator.createDatalabDaskWorkerDeployment(params);
      expect(manifest).toMatchSnapshot();
    });

    it('uses jupyter image if volumeMount/condaPath set', async () => {
      const manifest = await deploymentGenerator.createDatalabDaskWorkerDeployment({
        ...params,
        volumeMount: 'volume-mount',
        condaPath: '/data/conda/some-env',
      });
      expect(manifest).toMatchSnapshot();
    });
  });

  it('generates createDatalabDaskSchedulerService manifest', async () => {
    const params = {
      serviceName: 'service-name',
      schedulerPodLabel: 'scheduler-pod-label',
    };
    const manifest = await deploymentGenerator.createDatalabDaskSchedulerService(params);
    expect(manifest).toMatchSnapshot();
  });

  it('generates createDatalabDaskSchedulerNetworkPolicy manifest', async () => {
    const params = {
      networkPolicyName: 'policy-name',
      schedulerPodLabel: 'scheduler-pod-label',
      projectKey: 'project-key',
    };
    const manifest = await deploymentGenerator.createDatalabDaskSchedulerNetworkPolicy(params);
    expect(manifest).toMatchSnapshot();
  });

  describe('createDatalabSparkSchedulerDeployment', () => {
    const params = {
      deploymentName: 'deployment-name',
      clusterName: 'SPARK-deployment-name',
      type: 'spark',
      clusterImage: 'spark-image',
      jupyterLabImage: 'lab-image',
      schedulerPodLabel: 'scheduler-pod-label',
      schedulerContainerName: 'spark-scheduler-cont',
      schedulerMemory: 'scheduler-memory',
      schedulerCpu: 'scheduler-cpu',
    };
    it('uses spark image', async () => {
      const manifest = await deploymentGenerator.createDatalabSparkSchedulerDeployment(params);
      expect(manifest).toMatchSnapshot();
    });
  });

  describe('createDatalabSparkWorkerDeployment', () => {
    const params = {
      deploymentName: 'deployment-name',
      clusterImage: 'spark-image',
      jupyterLabImage: 'lab-image',
      workerPodLabel: 'worker-pod-label',
      workerContainerName: 'spark-worker-cont',
      workerMemory: 'worker-memory',
      workerCpu: 'worker-cpu',
      nThreads: 'n-threads',
      deathTimeoutSec: 'death-timeout-sec',
      schedulerServiceName: 'scheduler-service-name',
    };
    it('uses spark image', async () => {
      const manifest = await deploymentGenerator.createDatalabSparkWorkerDeployment(params);
      expect(manifest).toMatchSnapshot();
    });
  });

  it('generates createDatalabSparkSchedulerService manifest', async () => {
    const params = {
      serviceName: 'service-name',
      schedulerPodLabel: 'scheduler-pod-label',
    };
    const manifest = await deploymentGenerator.createDatalabSparkSchedulerService(params);
    expect(manifest).toMatchSnapshot();
  });

  it('generates createDatalabSparkSchedulerNetworkPolicy manifest', async () => {
    const params = {
      networkPolicyName: 'policy-name',
      schedulerPodLabel: 'scheduler-pod-label',
      projectKey: 'project-key',
    };
    const manifest = await deploymentGenerator.createDatalabSparkSchedulerNetworkPolicy(params);
    expect(manifest).toMatchSnapshot();
  });

  it('generates createAutoScaler manifest', async () => {
    const params = {
      autoScalerName: 'auto-scaler-name',
      scaleDeploymentName: 'scale-deployment-name',
      maxReplicas: 'max-replicas',
      targetCpuUtilization: 'target-cpu-utilization',
      targetMemoryUtilization: 'target-memory-utilization',
      scaleDownWindowSec: 'scale-down-window-sec',
    };
    const manifest = await deploymentGenerator.createAutoScaler(params);
    expect(manifest).toMatchSnapshot();
  });

  it('generates createJupyterDeployment manifest', async () => {
    const params = {
      projectKey: 'project-key',
      deploymentName: 'deployment-name',
      name: 'notebook-name',
      type: 'jupyterlab',
      volumeMount: 'volume-mount',
    };
    const manifest = await deploymentGenerator.createJupyterDeployment(params);
    expect(manifest).toMatchSnapshot();
  });

  describe('createRStudioConfigMap', () => {
    it('produces expected configmap', async () => {
      const manifest = await deploymentGenerator.createRStudioConfigMap('configmap-name', '/base/path');
      expect(manifest).toMatchSnapshot();
    });
  });

  describe('createRStudioDeployment', () => {
    it('creates expected manifest', async () => {
      const deploymentName = 'rstudio-name';
      const volumeMount = 'volumeMount';
      const type = stackTypes.RSTUDIO;
      const version = '4.0.1';
      const projectKey = 'projectKey';
      const name = 'name';
      const manifest = await deploymentGenerator.createRStudioDeployment({ deploymentName, volumeMount, type, version, projectKey, name });
      expect(manifest).toMatchSnapshot();
    });
  });

  describe('createSiteDeployment', () => {
    it('creates expected manifest', async () => {
      const deploymentName = 'panel-name';
      const sourcePath = 'notebooks/my-notebook';
      const type = stackTypes.PANEL;
      const volumeMount = 'volumeMount';
      const version = undefined;
      const condaPath = '/data/conda/my-env';
      const filename = 'notebook.ipynb';

      const manifest = await deploymentGenerator.createSiteDeployment({ deploymentName, sourcePath, type, volumeMount, version, condaPath, filename });

      expect(manifest).toMatchSnapshot();
    });

    it('creates expected manifest for RShiny', async () => {
      const deploymentName = 'rshiny-name';
      const sourcePath = 'notebooks/my-notebook';
      const type = stackTypes.RSHINY;
      const volumeMount = 'volumeMount';
      const version = '4.0.1';

      const manifest = await deploymentGenerator.createSiteDeployment({ deploymentName, sourcePath, type, volumeMount, version });

      expect(manifest).toMatchSnapshot();
    });
  });

  describe('createSiteService', () => {
    it('creates expected manifest', async () => {
      const serviceName = 'panel-name';
      const type = stackTypes.PANEL;

      const manifest = await deploymentGenerator.createSiteService({ serviceName, type });

      expect(manifest).toMatchSnapshot();
    });

    it('creates expected manifest for RShiny', async () => {
      const serviceName = 'rshiny-name';
      const type = stackTypes.RSHINY;
      const manifest = await deploymentGenerator.createSiteService({ serviceName, type });

      expect(manifest).toMatchSnapshot();
    });
  });
});
