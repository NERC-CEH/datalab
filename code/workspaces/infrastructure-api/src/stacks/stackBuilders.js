import chalk from 'chalk';
import logger from '../config/logger';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import configMapApi from '../kubernetes/configMapApi';
import ingressApi from '../kubernetes/ingressApi';
import volumeApi from '../kubernetes/volumeApi';
import deploymentGenerator from '../kubernetes/deploymentGenerator';

export const getSparkDriverHeadlessServiceName = name => `${name}-spark-driver-headless-service`;

export const createDeployment = (params, generator) => () => {
  const { name, projectKey, type } = params;
  const deploymentName = `${type}-${name}`;

  return generator({ ...params, deploymentName })
    .then((manifest) => {
      logger.info(`Creating deployment ${chalk.blue(deploymentName)} with manifest:`);
      logger.debug(manifest.toString());
      return deploymentApi.createOrUpdateDeployment(deploymentName, projectKey, manifest);
    });
};

export const createService = (params, generator) => () => {
  const { name, projectKey, type } = params;
  const serviceName = `${type}-${name}`;
  return generator(serviceName)
    .then((manifest) => {
      logger.info(`Creating service ${chalk.blue(serviceName)} with manifest:`);
      logger.debug(manifest.toString());
      return serviceApi.createOrUpdateService(serviceName, projectKey, manifest);
    });
};

export const createSparkDriverHeadlessService = params => () => {
  const { name, projectKey, type } = params;
  const notebookServiceName = `${type}-${name}`;
  const headlessServiceName = getSparkDriverHeadlessServiceName(notebookServiceName);
  return deploymentGenerator.createSparkDriverHeadlessService(notebookServiceName)
};

export const createConfigMap = (params, generator) => () => {
  const { name, projectKey, type } = params;
  const serviceName = `${type}-${name}`;
  return generator(serviceName, projectKey)
    .then((manifest) => {
      logger.info(`Creating configMap ${chalk.blue(serviceName)} with manifest:`);
      logger.debug(manifest.toString());
      return configMapApi.createOrReplaceNamespacedConfigMap(serviceName, projectKey, manifest);
    });
};

export const createIngressRule = (params, generator) => (service) => {
  const { name, projectKey, type } = params;
  const ingressName = `${type}-${name}`;
  const serviceName = service.metadata.name;
  const { port } = service.spec.ports[0];

  return generator({ ...params, ingressName, serviceName, port })
    .then((manifest) => {
      logger.info(`Creating ingress rule ${chalk.blue(ingressName)} with manifest:`);
      logger.debug(manifest.toString());
      return ingressApi.createOrUpdateIngress(ingressName, projectKey, manifest);
    });
};

export const createIngressRuleWithConnect = (params, generator) => (service) => {
  const { name, projectKey, type } = params;
  const ingressName = `${type}-${name}`;
  const serviceName = service.metadata.name;
  const { port } = service.spec.ports[0];
  const connectPort = service.spec.ports[1].port;

  return generator({ ...params, ingressName, serviceName, port, connectPort })
    .then((manifest) => {
      logger.info(`Creating ingress rule ${chalk.blue(ingressName)} with connect port from manifest:`);
      logger.debug(manifest.toString());
      return ingressApi.createOrUpdateIngress(ingressName, projectKey, manifest);
    });
};

export const createPersistentVolume = (params, generator) => () => {
  const { name, volumeSize, projectKey } = params;
  const volumeName = `${name}-claim`;

  return generator(volumeName, volumeSize)
    .then((manifest) => {
      logger.info(`Creating persistent volume ${chalk.blue(volumeName)} with manifest:`);
      logger.debug(manifest.toString());
      return volumeApi.createOrUpdatePersistentVolumeClaim(volumeName, projectKey, manifest);
    });
};
