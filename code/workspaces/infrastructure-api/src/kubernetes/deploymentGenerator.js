import fs from 'fs';
import yaml from 'js-yaml';
import { DeploymentTemplates, ServiceTemplates, generateManifest, ConfigMapTemplates } from './manifestGenerator';
import nameGenerator from '../common/nameGenerators';
import config from '../config/config';

const containerInfo = yaml.safeLoad(fs.readFileSync(config.get('containerInfoPath')));

function createJupyterDeployment({ projectKey, deploymentName, notebookName, type, volumeMount }) {
  const startCmd = type === 'jupyterlab' ? 'lab' : 'notebook';
  const context = {
    name: deploymentName,
    grantSudo: 'yes',
    domain: `${projectKey}-${notebookName}.${config.get('datalabDomain')}`,
    jupyter: {
      imageName: containerInfo.JUPYTER_IMAGE,
      version: containerInfo.JUPYTER_VERSION,
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

function createZeppelinDeployment({ deploymentName, volumeMount, type }) {
  const context = {
    name: deploymentName,
    grantSudo: true,
    sparkMasterAddress: containerInfo.SPARK_MASTER_ADDRESS,
    sharedRLibs: containerInfo.SHARED_R_LIBS,
    zeppelin: {
      imageName: containerInfo.ZEPPELIN_IMAGE,
      version: containerInfo.ZEPPELIN_VERSION,
      connectImageName: containerInfo.ZEPPELIN_CONNECT_IMAGE,
      connectVersion: containerInfo.ZEPPELIN_CONNECT_VERSION,
    },
    type,
    volumeMount,
  };

  return generateManifest(context, DeploymentTemplates.ZEPPELIN_DEPLOYMENT);
}

function createRStudioDeployment({ deploymentName, volumeMount, type }) {
  const context = {
    name: deploymentName,
    rstudio: {
      imageName: containerInfo.RSTUDIO_IMAGE,
      version: containerInfo.RSTUDIO_VERSION,
      connectImageName: containerInfo.RSTUDIO_CONNECT_IMAGE,
      connectVersion: containerInfo.RSTUDIO_CONNECT_VERSION,
    },
    type,
    volumeMount,
  };

  return generateManifest(context, DeploymentTemplates.RSTUDIO_DEPLOYMENT);
}

function createRShinyDeployment({ deploymentName, sourcePath, type, volumeMount }) {
  const context = {
    name: deploymentName,
    sourcePath,
    rshiny: {
      imageName: containerInfo.RSHINY_IMAGE,
      version: containerInfo.RSHINY_VERSION,
    },
    type,
    volumeMount,
  };

  return generateManifest(context, DeploymentTemplates.RSHINY_DEPLOYMENT);
}

function createNbViewerDeployment({ deploymentName, sourcePath, type, volumeMount }) {
  const context = {
    name: deploymentName,
    sourcePath,
    nbviewer: {
      imageName: containerInfo.NBVIEWER_IMAGE,
      version: containerInfo.NBVIEWER_VERSION,
    },
    type,
    volumeMount,
  };

  return generateManifest(context, DeploymentTemplates.NBVIEWER_DEPLOYMENT);
}

function createMinioDeployment({ name, deploymentName, type }) {
  const context = {
    name: deploymentName,
    // This mapping of name to volume name is because the volume names
    // don't have the stack name in so we need the raw volume name for the mount.
    volumeName: name,
    domain: config.get('datalabDomain'),
    minio: {
      imageName: containerInfo.MINIO_IMAGE,
      version: containerInfo.MINIO_VERSION,
      connectImageName: containerInfo.MINIO_CONNECT_IMAGE,
      connectVersion: containerInfo.MINIO_CONNECT_VERSION,
    },
    type,
  };

  return generateManifest(context, DeploymentTemplates.MINIO_DEPLOYMENT);
}

function createJupyterService(notebookName) {
  const context = { name: notebookName };
  return generateManifest(context, ServiceTemplates.JUPYTER_SERVICE);
}

function createZeppelinService(name) {
  const context = { name };
  return generateManifest(context, ServiceTemplates.ZEPPELIN_SERVICE);
}

function createRStudioService(name) {
  const context = { name };
  return generateManifest(context, ServiceTemplates.RSTUDIO_SERVICE);
}

function createRShinyService(name) {
  const context = { name };
  return generateManifest(context, ServiceTemplates.RSHINY_SERVICE);
}

function createNbViewerService(name) {
  const context = { name };
  return generateManifest(context, ServiceTemplates.NBVIEWER_SERVICE);
}

function createMinioService(name) {
  const context = { name };
  return generateManifest(context, ServiceTemplates.MINIO_SERVICE);
}

function createSparkDriverHeadlessService(notebookName) {
  const context = {
    name: nameGenerator.sparkDriverHeadlessService(notebookName),
    'deployment-service-name': notebookName,
  };
  return generateManifest(context, ServiceTemplates.SPARK_DRIVER_HEADLESS_SERVICE);
}

function createPySparkConfigMap(notebookName, projectKey) {
  const context = {
    configMapName: nameGenerator.pySparkConfigMap(notebookName),
    projectNamespace: nameGenerator.projectNamespace(projectKey),
    projectComputeNamespace: nameGenerator.projectComputeNamespace(projectKey),
    sparkDriverHeadlessServiceName: nameGenerator.sparkDriverHeadlessService(notebookName),
    jobName: nameGenerator.sparkJob(notebookName),
  };
  return generateManifest(context, ConfigMapTemplates.PYSPARK_CONFIGMAP);
}

function createDaskConfigMap(notebookName, projectKey) {
  const context = {
    configMapName: nameGenerator.daskConfigMap(notebookName),
    projectNamespace: nameGenerator.projectNamespace(projectKey),
    projectComputeNamespace: nameGenerator.projectComputeNamespace(projectKey),
  };
  return generateManifest(context, ConfigMapTemplates.DASK_CONFIGMAP);
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
};
