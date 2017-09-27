import { DeploymentTemplates, ServiceTemplates, generateManifest } from './manifestGenerator';

const JUPYTER_IMAGE = 'nerc/jupyter-notebook';
const JUPYTER_VERSION = '0.1.3';

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

function createJupyterService(notebookName) {
  const context = { name: notebookName };
  return generateManifest(context, ServiceTemplates.JUPYTER_SERVICE);
}

export default { createJupyterDeployment, createJupyterService };
