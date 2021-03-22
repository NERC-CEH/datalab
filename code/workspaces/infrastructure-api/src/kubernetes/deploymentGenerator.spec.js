import deploymentGenerator from './deploymentGenerator';

describe('deploymentGenerator', () => {
  describe('createDatalabDaskSchedulerDeployment', () => {
    const params = {
      deploymentName: 'deployment-name',
      pureDaskImage: 'dask-image',
      jupyterLabImage: 'lab-image',
      schedulerPodLabel: 'scheduler-pod-label',
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
      pureDaskImage: 'dask-image',
      jupyterLabImage: 'lab-image',
      workerPodLabel: 'worker-pod-label',
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
});
