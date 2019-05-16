import { DeploymentTemplates, ServiceTemplates, generateManifest } from './manifestGenerator';

const JUPYTER_IMAGE = 'nercceh/jupyter-notebook';
const JUPYTER_VERSION = '0.0.1-1-g93f3cec';

const JUPYTERLAB_IMAGE = 'nercceh/jupyter-lab';
const JUPYTERLAB_VERSION = '0.0.2-21-g4f8bf00';

const ZEPPELIN_IMAGE = 'nerc/zeppelin';
const ZEPPELIN_VERSION = '0.7.2.7';
const ZEPPELIN_CONNECT_IMAGE = 'nerc/zeppelin-connect';
const ZEPPELIN_CONNECT_VERSION = '1.1.1';

const RSTUDIO_IMAGE = 'nercceh/rstudio';
const RSTUDIO_VERSION = '0.0.1-4-g7dcbeb1';
const RSTUDIO_CONNECT_IMAGE = 'nerc/zeppelin-connect'; // This name should be zeppelin-connect as the image is shared
const RSTUDIO_CONNECT_VERSION = '1.1.1';

const RSHINY_IMAGE = 'nercceh/rshiny';
const RSHINY_VERSION = '0.0.1-3-g56623f4';

const NBVIEWER_IMAGE = 'nercceh/jupyter-nbviewer';
const NBVIEWER_VERSION = '0.0.1-1-g129dec8';

const SPARK_MASTER_ADDRESS = 'spark://spark-master:7077';
const SHARED_R_LIBS = '/data/packages/R/%p/%v';
const SCRATCH_VOLUME = 'scratch';

const MINIO_IMAGE = 'nerc/minio';
const MINIO_VERSION = '1.0';
const MINIO_CONNECT_IMAGE = 'nerc/connect';
const MINIO_CONNECT_VERSION = '1.0.0';

function createJupyterDeployment({ datalabInfo, deploymentName, notebookName, type, volumeMount }) {
  const context = {
    name: deploymentName,
    grantSudo: true,
    domain: `${datalabInfo.name}-${notebookName}.${datalabInfo.domain}`,
    jupyter: {
      imageName: JUPYTER_IMAGE,
      version: JUPYTER_VERSION,
    },
    type,
    volumeMount,
    scratchVolumeMount: SCRATCH_VOLUME,
  };

  return generateManifest(context, DeploymentTemplates.JUPYTER_DEPLOYMENT);
}

function createJupyterlabDeployment({ datalabInfo, deploymentName, notebookName, type, volumeMount }) {
  const context = {
    name: deploymentName,
    // Grant sudo access using 'yes' as true does not work for JupyterLab Image
    grantSudo: 'yes',
    domain: `${datalabInfo.name}-${notebookName}.${datalabInfo.domain}`,
    jupyterlab: {
      imageName: JUPYTERLAB_IMAGE,
      version: JUPYTERLAB_VERSION,
    },
    type,
    volumeMount,
    scratchVolumeMount: SCRATCH_VOLUME,
  };

  return generateManifest(context, DeploymentTemplates.JUPYTERLAB_DEPLOYMENT);
}

function createZeppelinDeployment({ deploymentName, volumeMount, type }) {
  const context = {
    name: deploymentName,
    grantSudo: true,
    sparkMasterAddress: SPARK_MASTER_ADDRESS,
    sharedRLibs: SHARED_R_LIBS,
    zeppelin: {
      imageName: ZEPPELIN_IMAGE,
      version: ZEPPELIN_VERSION,
      connectImageName: ZEPPELIN_CONNECT_IMAGE,
      connectVersion: ZEPPELIN_CONNECT_VERSION,
    },
    type,
    volumeMount,
    scratchVolumeMount: SCRATCH_VOLUME,
  };

  return generateManifest(context, DeploymentTemplates.ZEPPELIN_DEPLOYMENT);
}

function createRStudioDeployment({ deploymentName, volumeMount, type }) {
  const context = {
    name: deploymentName,
    rstudio: {
      imageName: RSTUDIO_IMAGE,
      version: RSTUDIO_VERSION,
      connectImageName: RSTUDIO_CONNECT_IMAGE,
      connectVersion: RSTUDIO_CONNECT_VERSION,
    },
    type,
    volumeMount,
    scratchVolumeMount: SCRATCH_VOLUME,
  };

  return generateManifest(context, DeploymentTemplates.RSTUDIO_DEPLOYMENT);
}

function createRShinyDeployment({ deploymentName, sourcePath, type, volumeMount }) {
  const context = {
    name: deploymentName,
    sourcePath,
    rshiny: {
      imageName: RSHINY_IMAGE,
      version: RSHINY_VERSION,
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
      imageName: NBVIEWER_IMAGE,
      version: NBVIEWER_VERSION,
    },
    type,
    volumeMount,
  };

  return generateManifest(context, DeploymentTemplates.NBVIEWER_DEPLOYMENT);
}

function createMinioDeployment({ datalabInfo, name, deploymentName, type }) {
  const context = {
    name: deploymentName,
    // This mapping of name to volume name is because the volume names
    // don't have the stack name in so we need the raw volume name for the mount.
    volumeName: name,
    domain: datalabInfo.domain,
    minio: {
      imageName: MINIO_IMAGE,
      version: MINIO_VERSION,
      connectImageName: MINIO_CONNECT_IMAGE,
      connectVersion: MINIO_CONNECT_VERSION,
    },
    type,
  };

  return generateManifest(context, DeploymentTemplates.MINIO_DEPLOYMENT);
}

function createJupyterService(notebookName) {
  const context = { name: notebookName };
  return generateManifest(context, ServiceTemplates.JUPYTER_SERVICE);
}

function createJupyterlabService(notebookName) {
  const context = { name: notebookName };
  return generateManifest(context, ServiceTemplates.JUPYTERLAB_SERVICE);
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

export default {
  createJupyterDeployment,
  createJupyterlabDeployment,
  createZeppelinDeployment,
  createRStudioDeployment,
  createRShinyDeployment,
  createNbViewerDeployment,
  createMinioDeployment,
  createJupyterService,
  createJupyterlabService,
  createZeppelinService,
  createRStudioService,
  createRShinyService,
  createNbViewerService,
  createMinioService,
};
