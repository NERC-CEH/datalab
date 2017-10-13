import { DeploymentTemplates, ServiceTemplates, generateManifest } from './manifestGenerator';

const JUPYTER_IMAGE = 'nerc/jupyter-notebook';
const JUPYTER_VERSION = '0.1.3';

const ZEPPELIN_IMAGE = 'nerc/zeppelin';
const ZEPPELIN_VERSION = '0.7.2.7';
const ZEPPELIN_CONNECT_IMAGE = 'nerc/zeppelin-connect';
const ZEPPELIN_CONNECT_VERSION = '1.1.1';

const RSTUDIO_IMAGE = 'rocker/rstudio';
const RSTUDIO_VERSION = '3.4.0';
const RSTUDIO_CONNECT_IMAGE = 'nerc/zeppelin-connect'; // This name should be zeppelin-connect as the image is shared
const RSTUDIO_CONNECT_VERSION = '1.1.1';

const RSHINY_IMAGE = 'nerc/rshiny';
const RSHINY_VERSION = '0.1.1';

const SPARK_MASTER_ADDRESS = 'spark://spark-master:7077';
const SHARED_R_LIBS = '/data/packages/R/%p/%v';

function createJupyterDeployment({ datalabInfo, deploymentName, notebookName }) {
  const context = {
    name: deploymentName,
    grantSudo: true,
    datalabVolume: datalabInfo.volume,
    domain: `${datalabInfo.name}-${notebookName}.${datalabInfo.domain}`,
    jupyter: {
      imageName: JUPYTER_IMAGE,
      version: JUPYTER_VERSION,
    },
  };

  return generateManifest(context, DeploymentTemplates.JUPYTER_DEPLOYMENT);
}

function createZeppelinDeployment({ datalabInfo, deploymentName }) {
  const context = {
    name: deploymentName,
    grantSudo: true,
    datalabVolume: datalabInfo.volume,
    sparkMasterAddress: SPARK_MASTER_ADDRESS,
    sharedRLibs: SHARED_R_LIBS,
    zeppelin: {
      imageName: ZEPPELIN_IMAGE,
      version: ZEPPELIN_VERSION,
      connectImageName: ZEPPELIN_CONNECT_IMAGE,
      connectVersion: ZEPPELIN_CONNECT_VERSION,
    },
  };

  return generateManifest(context, DeploymentTemplates.ZEPPELIN_DEPLOYMENT);
}

function createRStudioDeployment({ datalabInfo, deploymentName }) {
  const context = {
    name: deploymentName,
    datalabVolume: datalabInfo.volume,
    rstudio: {
      imageName: RSTUDIO_IMAGE,
      version: RSTUDIO_VERSION,
      connectImageName: RSTUDIO_CONNECT_IMAGE,
      connectVersion: RSTUDIO_CONNECT_VERSION,
    },
  };

  return generateManifest(context, DeploymentTemplates.RSTUDIO_DEPLOYMENT);
}

function createRShinyDeployment({ datalabInfo, deploymentName, sourcePath }) {
  const context = {
    name: deploymentName,
    datalabVolume: datalabInfo.volume,
    sourcePath,
    rshiny: {
      imageName: RSHINY_IMAGE,
      version: RSHINY_VERSION,
    },
  };

  return generateManifest(context, DeploymentTemplates.RSHINY_DEPLOYMENT);
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

export default {
  createJupyterDeployment,
  createZeppelinDeployment,
  createRStudioDeployment,
  createRShinyDeployment,
  createJupyterService,
  createZeppelinService,
  createRStudioService,
  createRShinyService,
};
