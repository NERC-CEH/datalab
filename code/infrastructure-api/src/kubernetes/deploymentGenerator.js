import { DeploymentTemplates, ServiceTemplates, generateManifest } from './manifestGenerator';

const JUPYTER_IMAGE = 'nerc/jupyter-notebook';
const JUPYTER_VERSION = '0.1.3';

const RSTUDIO_IMAGE = 'rocker/rstudio';
const RSTUDIO_VERSION = '3.4.0';

function createJupyterDeployment(datalab, deploymentName, notebookName) {
  const context = {
    name: deploymentName,
    grantSudo: true,
    datalabVolume: datalab.volume,
    domain: `${datalab.name}-${notebookName}.${datalab.domain}`,
    jupyter: {
      imageName: JUPYTER_IMAGE,
      version: JUPYTER_VERSION,
    },
  };

  return generateManifest(context, DeploymentTemplates.JUPYTER_DEPLOYMENT);
}

function createRStudioDeployment(datalab, deploymentName) {
  const context = {
    name: deploymentName,
    datalabVolume: datalab.volume,
    rstudio: {
      imageName: RSTUDIO_IMAGE,
      version: RSTUDIO_VERSION,
    },
  };

  return generateManifest(context, DeploymentTemplates.RSTUDIO_DEPLOYMENT);
}

function createJupyterService(notebookName) {
  const context = { name: notebookName };
  return generateManifest(context, ServiceTemplates.JUPYTER_SERVICE);
}

function createRStudioService(name) {
  const context = { name };
  return generateManifest(context, ServiceTemplates.RSTUDIO_SERVICE);
}

export default { createJupyterDeployment, createRStudioDeployment, createRStudioService, createJupyterService };
