import fs from 'fs-extra-promise';
import { render } from 'mustache';

const ServiceTemplates = Object.freeze({
  JUPYTER_SERVICE: 'jupyter.service.template.yml',
  ZEPPELIN_SERVICE: 'zeppelin.service.template.yml',
  RSTUDIO_SERVICE: 'rstudio.service.template.yml',
});

const DeploymentTemplates = Object.freeze({
  JUPYTER_DEPLOYMENT: 'jupyter.deployment.template.yml',
  ZEPPELIN_DEPLOYMENT: 'zeppelin.deployment.template.yml',
  RSTUDIO_DEPLOYMENT: 'rstudio.deployment.template.yml',
});

const ConfigTemplates = Object.freeze({
  ZEPPELIN_CONFIG: 'zeppelin.shiro.template.ini',
});

function generateManifest(context, template) {
  const templatePath = `manifests/${template}`;
  return fs.readFileAsync(templatePath)
    .then(data => data.toString())
    .then(templateContent => render(templateContent, context));
}

export { ServiceTemplates, DeploymentTemplates, ConfigTemplates, generateManifest };
