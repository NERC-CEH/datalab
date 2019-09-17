import { DeploymentTemplates, ServiceTemplates, generateManifest } from './manifestGenerator';
import config from '../config/config';

const JUPYTER_IMAGE = 'nerc/jupyter-notebook';
const JUPYTER_VERSION = '0.1.3';

const JUPYTERLAB_IMAGE = 'nerc/jupyterlab';
const JUPYTERLAB_VERSION = '0.1.1';

const ZEPPELIN_IMAGE = 'nerc/zeppelin';
const ZEPPELIN_VERSION = '0.7.2.7';
const ZEPPELIN_CONNECT_IMAGE = 'nerc/zeppelin-connect';
const ZEPPELIN_CONNECT_VERSION = '1.1.1';

const RSTUDIO_IMAGE = 'nerc/rstudio';
const RSTUDIO_VERSION = '0.1.2';
const RSTUDIO_CONNECT_IMAGE = 'nerc/zeppelin-connect'; // This name should be zeppelin-connect as the image is shared
const RSTUDIO_CONNECT_VERSION = '1.1.1';

const RSHINY_IMAGE = 'nerc/rshiny';
const RSHINY_VERSION = '0.1.2';

const NBVIEWER_IMAGE = 'jupyter/nbviewer';
const NBVIEWER_VERSION = 'latest';

const SPARK_MASTER_ADDRESS = 'spark://spark-master:7077';
const SHARED_R_LIBS = '/data/packages/R/%p/%v';

const MINIO_IMAGE = 'nerc/minio';
const MINIO_VERSION = '1.0';
const MINIO_CONNECT_IMAGE = 'nerc/connect';
const MINIO_CONNECT_VERSION = '1.0.0';

function createJupyterDeployment({ projectKey, deploymentName, notebookName, type, volumeMount }) {
  const context = {
    name: deploymentName,
    grantSudo: true,
    domain: `${projectKey}-${notebookName}.${config.get('datalabDomain')}`,
    jupyter: {
      imageName: JUPYTER_IMAGE,
      version: JUPYTER_VERSION,
    },
    type,
    volumeMount,
  };

  return generateManifest(context, DeploymentTemplates.JUPYTER_DEPLOYMENT);
}

function createJupyterlabDeployment({ projectKey, deploymentName, notebookName, type, volumeMount }) {
  const context = {
    name: deploymentName,
    grantSudo: true,
    domain: `${projectKey}-${notebookName}.${config.get('datalabDomain')}`,
    jupyterlab: {
      imageName: JUPYTERLAB_IMAGE,
      version: JUPYTERLAB_VERSION,
    },
    type,
    volumeMount,
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

function createMinioDeployment({ name, deploymentName, type }) {
  const context = {
    name: deploymentName,
    // This mapping of name to volume name is because the volume names
    // don't have the stack name in so we need the raw volume name for the mount.
    volumeName: name,
    domain: config.get('datalabDomain'),
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
