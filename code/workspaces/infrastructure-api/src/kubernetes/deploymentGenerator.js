import { imageConfig, image, defaultImage } from 'common/src/config/images';
import { DeploymentTemplates, ServiceTemplates, generateManifest, ConfigMapTemplates, NetworkPolicyTemplates, AutoScalerTemplates } from './manifestGenerator';
import nameGenerator from '../common/nameGenerators';
import config from '../config/config';
import logger from '../config/logger';

const containerInfo = imageConfig();

function getImage(type, version) {
  try {
    return version ? image(type, version) : defaultImage(type);
  } catch (error) {
    logger.error(`Failed to get image with error message: ${error.message}`);
    throw error;
  }
}

function createJupyterDeployment({ projectKey, deploymentName, notebookName, type, volumeMount, version }) {
  const startCmd = type === 'jupyterlab' ? 'lab' : 'notebook';
  const img = getImage(type, version);
  const context = {
    name: deploymentName,
    grantSudo: 'yes',
    domain: `${projectKey}-${notebookName}.${config.get('datalabDomain')}`,
    jupyter: {
      image: img.image,
    },
    serviceAccount: nameGenerator.computeSubmissionServiceAccount(projectKey),
    pySparkConfigMapName: nameGenerator.pySparkConfigMap(deploymentName),
    daskConfigMapName: nameGenerator.daskConfigMap(deploymentName),
    type,
    startCmd,
    volumeMount,
  };

  return generateManifest(context, DeploymentTemplates.JUPYTER_DEPLOYMENT);
}

function createDatalabDaskSchedulerDeployment({ deploymentName, condaPath, pureDaskImage, jupyterLabImage, schedulerPodLabel, schedulerMemory, schedulerCpu, volumeMount }) {
  const context = {
    name: deploymentName,
    daskImage: condaPath ? jupyterLabImage : pureDaskImage,
    schedulerPath: condaPath ? `${condaPath}/bin/dask-scheduler` : 'dask-scheduler',
    schedulerPodLabel,
    schedulerMemory,
    schedulerCpu,
    volumeMount,
  };
  return generateManifest(context, DeploymentTemplates.DATALAB_DASK_SCHEDULER_DEPLOYMENT);
}

function createDatalabDaskWorkerDeployment({ deploymentName, condaPath, pureDaskImage, jupyterLabImage, workerPodLabel, workerMemory, workerCpu, volumeMount, nThreads, deathTimeoutSec,
  schedulerServiceName }) {
  const context = {
    name: deploymentName,
    daskImage: condaPath ? jupyterLabImage : pureDaskImage,
    workerPath: condaPath ? `${condaPath}/bin/dask-worker` : 'dask-worker',
    workerPodLabel,
    workerMemory,
    workerCpu,
    volumeMount,
    nThreads,
    deathTimeoutSec,
    schedulerServiceName,
  };
  return generateManifest(context, DeploymentTemplates.DATALAB_DASK_WORKER_DEPLOYMENT);
}

function createZeppelinDeployment({ deploymentName, volumeMount, type, version }) {
  const img = getImage(type, version);
  const context = {
    name: deploymentName,
    grantSudo: true,
    sparkMasterAddress: containerInfo.spark.masterAddress,
    sharedRLibs: containerInfo.spark.sharedRLibs,
    zeppelin: {
      image: img.image,
      connectImage: img.connectImage,
    },
    type,
    volumeMount,
  };

  return generateManifest(context, DeploymentTemplates.ZEPPELIN_DEPLOYMENT);
}

function createRStudioDeployment({ deploymentName, volumeMount, type, version }) {
  const img = getImage(type, version);
  const context = {
    name: deploymentName,
    rstudio: {
      image: img.image,
      connectImage: img.connectImage,
    },
    type,
    volumeMount,
  };

  return generateManifest(context, DeploymentTemplates.RSTUDIO_DEPLOYMENT);
}

function createRShinyDeployment({ deploymentName, sourcePath, type, volumeMount, version }) {
  const img = getImage(type, version);
  const context = {
    name: deploymentName,
    sourcePath,
    rshiny: {
      image: img.image,
    },
    type,
    volumeMount,
  };

  return generateManifest(context, DeploymentTemplates.RSHINY_DEPLOYMENT);
}

function createNbViewerDeployment({ deploymentName, sourcePath, type, volumeMount, version }) {
  const img = getImage(type, version);
  const context = {
    name: deploymentName,
    sourcePath,
    nbviewer: {
      image: img.image,
    },
    type,
    volumeMount,
  };

  return generateManifest(context, DeploymentTemplates.NBVIEWER_DEPLOYMENT);
}

function createMinioDeployment({ name, deploymentName, type, version }) {
  const img = getImage(type, version);
  const context = {
    name: deploymentName,
    // This mapping of name to volume name is because the volume names
    // don't have the stack name in so we need the raw volume name for the mount.
    volumeName: name,
    domain: config.get('datalabDomain'),
    minio: {
      image: img.image,
      connectImage: img.connectImage,
    },
    type,
  };

  return generateManifest(context, DeploymentTemplates.MINIO_DEPLOYMENT);
}

function createJupyterService({ serviceName }) {
  const context = { name: serviceName };
  return generateManifest(context, ServiceTemplates.JUPYTER_SERVICE);
}

function createDatalabDaskSchedulerService({ serviceName, schedulerPodLabel }) {
  const context = {
    name: serviceName,
    schedulerPodLabel,
  };
  return generateManifest(context, ServiceTemplates.DATALAB_DASK_SCHEDULER_SERVICE);
}

function createZeppelinService({ serviceName }) {
  const context = { name: serviceName };
  return generateManifest(context, ServiceTemplates.ZEPPELIN_SERVICE);
}

function createRStudioService({ serviceName }) {
  const context = { name: serviceName };
  return generateManifest(context, ServiceTemplates.RSTUDIO_SERVICE);
}

function createRShinyService({ serviceName }) {
  const context = { name: serviceName };
  return generateManifest(context, ServiceTemplates.RSHINY_SERVICE);
}

function createNbViewerService({ serviceName }) {
  const context = { name: serviceName };
  return generateManifest(context, ServiceTemplates.NBVIEWER_SERVICE);
}

function createMinioService({ serviceName }) {
  const context = { name: serviceName };
  return generateManifest(context, ServiceTemplates.MINIO_SERVICE);
}

function createSparkDriverHeadlessService({ serviceName }) {
  const context = {
    name: nameGenerator.sparkDriverHeadlessService(serviceName),
    'deployment-service-name': serviceName,
  };
  return generateManifest(context, ServiceTemplates.SPARK_DRIVER_HEADLESS_SERVICE);
}

function createPySparkConfigMap(notebookName, projectKey, configMapName) {
  const img = getImage('spark');
  const context = {
    spark: {
      image: img.image,
    },
    configMapName,
    projectNamespace: nameGenerator.projectNamespace(projectKey),
    projectComputeNamespace: nameGenerator.projectComputeNamespace(projectKey),
    sparkDriverHeadlessServiceName: nameGenerator.sparkDriverHeadlessService(notebookName),
    jobName: nameGenerator.sparkJob(notebookName),
  };
  return generateManifest(context, ConfigMapTemplates.PYSPARK_CONFIGMAP);
}

function createDaskConfigMap(notebookName, projectKey, configMapName) {
  const img = getImage('dask');
  const context = {
    dask: {
      image: img.image,
    },
    configMapName,
    projectNamespace: nameGenerator.projectNamespace(projectKey),
    projectComputeNamespace: nameGenerator.projectComputeNamespace(projectKey),
  };
  return generateManifest(context, ConfigMapTemplates.DASK_CONFIGMAP);
}

function createDatalabDaskSchedulerNetworkPolicy(name, schedulerPodLabel, projectKey) {
  const context = { name, schedulerPodLabel, projectKey };
  return generateManifest(context, NetworkPolicyTemplates.DATALAB_DASK_SCHEDULER_NETWORK_POLICY);
}

function createAutoScaler(autoScalerName, scaleDeploymentName, maxReplicas, targetCpuUtilization, targetMemoryUtilization, scaleDownWindowSec) {
  const context = {
    autoScalerName,
    scaleDeploymentName,
    maxReplicas,
    targetCpuUtilization,
    targetMemoryUtilization,
    scaleDownWindowSec,
  };
  return generateManifest(context, AutoScalerTemplates.AUTO_SCALER);
}

export default {
  createJupyterDeployment,
  createZeppelinDeployment,
  createRStudioDeployment,
  createRShinyDeployment,
  createNbViewerDeployment,
  createMinioDeployment,
  createJupyterService,
  createZeppelinService,
  createRStudioService,
  createRShinyService,
  createNbViewerService,
  createMinioService,
  createSparkDriverHeadlessService,
  createPySparkConfigMap,
  createDaskConfigMap,
  createDatalabDaskSchedulerDeployment,
  createDatalabDaskWorkerDeployment,
  createDatalabDaskSchedulerService,
  createDatalabDaskSchedulerNetworkPolicy,
  createAutoScaler,
};
