import fs from 'fs-extra-promise';
import { render } from 'mustache';

const ServiceTemplates = Object.freeze({
  JUPYTER_SERVICE: 'jupyter.service.template.yml',
  JUPYTERLAB_SERVICE: 'jupyterlab.service.template.yml',
  ZEPPELIN_SERVICE: 'zeppelin.service.template.yml',
  RSTUDIO_SERVICE: 'rstudio.service.template.yml',
  RSHINY_SERVICE: 'rshiny.service.template.yml',
  NBVIEWER_SERVICE: 'nbviewer.service.template.yml',
  MINIO_SERVICE: 'minio.service.template.yml',
});

const DeploymentTemplates = Object.freeze({
  JUPYTER_DEPLOYMENT: 'jupyter.deployment.template.yml',
  JUPYTERLAB_DEPLOYMENT: 'jupyterlab.deployment.template.yml',
  ZEPPELIN_DEPLOYMENT: 'zeppelin.deployment.template.yml',
  RSTUDIO_DEPLOYMENT: 'rstudio.deployment.template.yml',
  RSHINY_DEPLOYMENT: 'rshiny.deployment.template.yml',
  NBVIEWER_DEPLOYMENT: 'nbviewer.deployment.template.yml',
  MINIO_DEPLOYMENT: 'minio.deployment.template.yml',
});

const IngressTemplates = Object.freeze({
  DEFAULT_INGRESS: 'default.ingress.template.yml',
});

const VolumeTemplates = Object.freeze({
  DEFAULT_VOLUME: 'default.pvc.template.yml',
});

const ConfigTemplates = Object.freeze({
  ZEPPELIN_CONFIG: 'zeppelin.shiro.template.ini',
});

function generateManifest(context, template) {
  const templatePath = `resources/${template}`;
  return fs.readFileAsync(templatePath)
    .then(data => data.toString())
    .then(templateContent => render(templateContent, context));
}

export { ServiceTemplates, DeploymentTemplates, IngressTemplates, VolumeTemplates, ConfigTemplates, generateManifest };
