import fs from 'fs-extra-promise';
import { render } from 'mustache';

const ServiceTemplates = Object.freeze({
  JUPYTER_SERVICE: 'jupyter.service.template.yml',
  JUPYTERLAB_SERVICE: 'jupyterlab.service.template.yml',
  ZEPPELIN_SERVICE: 'zeppelin.service.template.yml',
  RSTUDIO_SERVICE: 'rstudio.service.template.yml',
  RSHINY_SERVICE: 'rshiny.service.template.yml',
  NBVIEWER_SERVICE: 'nbviewer.service.template.yml',
  PANEL_SERVICE: 'panel.service.template.yml',
  VOILA_SERVICE: 'voila.service.template.yml',
  MINIO_SERVICE: 'minio.service.template.yml',
  SPARK_DRIVER_HEADLESS_SERVICE: 'spark-driver.headless-service.template.yml',
  DATALAB_DASK_SCHEDULER_SERVICE: 'datalab-dask-scheduler.service.template.yml',
  DATALAB_SPARK_SCHEDULER_SERVICE: 'datalab-spark-scheduler.service.template.yml',
});

const DeploymentTemplates = Object.freeze({
  JUPYTER_DEPLOYMENT: 'jupyter.deployment.template.yml',
  JUPYTERLAB_DEPLOYMENT: 'jupyterlab.deployment.template.yml',
  ZEPPELIN_DEPLOYMENT: 'zeppelin.deployment.template.yml',
  RSTUDIO_DEPLOYMENT: 'rstudio.deployment.template.yml',
  RSHINY_DEPLOYMENT: 'rshiny.deployment.template.yml',
  NBVIEWER_DEPLOYMENT: 'nbviewer.deployment.template.yml',
  PANEL_DEPLOYMENT: 'panel.deployment.template.yml',
  VOILA_DEPLOYMENT: 'voila.deployment.template.yml',
  MINIO_DEPLOYMENT: 'minio.deployment.template.yml',
  DATALAB_DASK_SCHEDULER_DEPLOYMENT: 'datalab-dask-scheduler.deployment.template.yml',
  DATALAB_DASK_WORKER_DEPLOYMENT: 'datalab-dask-worker.deployment.template.yml',
  DATALAB_SPARK_SCHEDULER_DEPLOYMENT: 'datalab-spark-scheduler.deployment.template.yml',
  DATALAB_SPARK_WORKER_DEPLOYMENT: 'datalab-spark-worker.deployment.template.yml',
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

const ConfigMapTemplates = Object.freeze({
  PYSPARK_CONFIGMAP: 'pyspark.configmap.template.yml',
  DASK_CONFIGMAP: 'dask.configmap.template.yml',
  JUPYTER_CONFIGMAP: 'jupyter.configmap.template.yml',
  RSTUDIO_CONFIGMAP: 'rstudio.configmap.template.yml',
});

const NetworkPolicyTemplates = Object.freeze({
  DATALAB_DASK_SCHEDULER_NETWORK_POLICY: 'datalab-dask-scheduler.network-policy.template.yml',
  DATALAB_SPARK_SCHEDULER_NETWORK_POLICY: 'datalab-spark-scheduler.network-policy.template.yml',
});

const AutoScalerTemplates = Object.freeze({
  AUTO_SCALER: 'auto-scaler.template.yml',
});

function generateManifest(context, template) {
  const templatePath = `resources/${template}`;
  return fs.readFileAsync(templatePath)
    .then(data => data.toString())
    .then(templateContent => render(templateContent, context));
}

export { ServiceTemplates, DeploymentTemplates, IngressTemplates, VolumeTemplates, ConfigTemplates, ConfigMapTemplates, NetworkPolicyTemplates, AutoScalerTemplates, generateManifest };
