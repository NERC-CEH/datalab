import fs from 'fs-extra-promise';
import { render } from 'mustache';

const ServiceTemplates = Object.freeze({
  JUPYTER_SERVICE: 'jupyter.service.template.yml',
});

const DeploymentTemplates = Object.freeze({
  JUPYTER_DEPLOYMENT: 'jupyter.deployment.template.yml',
});

function generateManifest(context, template) {
  const templatePath = `manifests/${template}`;
  return fs.readFileAsync(templatePath)
    .then(data => data.toString())
    .then(templateContent => render(templateContent, context));
}

export { ServiceTemplates, DeploymentTemplates, generateManifest };
