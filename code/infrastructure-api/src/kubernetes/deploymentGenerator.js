import fs from 'fs-extra-promise';
import { render } from 'mustache';

const JUPYTER_IMAGE = 'nerc/jupyter-notebook';
const JUPYTER_VERSION = '0.1.0';
const JUPYTER_TEMPLATE = 'manifests/jupyter.deployment.template.yml';

function createJupyterDeployment(datalab, deploymentName, notebookName) {
  const properties = {
    name: deploymentName,
    grantSudo: true,
    datalabVolume: datalab.volume,
    domain: `${datalab.name}-${notebookName}.${datalab.domain}`,
    jupyter: {
      imageName: JUPYTER_IMAGE,
      version: JUPYTER_VERSION,
    },
  };

  return fs.readFileAsync(JUPYTER_TEMPLATE)
    .then(data => data.toString())
    .then(template => render(template, properties));
}

export default { createJupyterDeployment };
