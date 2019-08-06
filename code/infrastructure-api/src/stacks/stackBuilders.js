import logger from '../config/logger';
import chalk from 'chalk';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressApi from '../kubernetes/ingressApi';
import volumeApi from '../kubernetes/volumeApi';

export const createDeployment = (params, generator) => () => {
  const { name, type } = params;
  const deploymentName = `${type}-${name}`;

  return generator({ ...params, deploymentName })
    .then((manifest) => {
      logger.info(`Creating deployment ${chalk.blue(deploymentName)} with manifest:`);
      logger.debug(manifest.toString());
      return deploymentApi.createOrUpdateDeployment(deploymentName, manifest);
    });
};

export const createService = (name, type, generator) => () => {
  const serviceName = `${type}-${name}`;
  return generator(serviceName)
    .then((manifest) => {
      logger.info(`Creating service ${chalk.blue(serviceName)} with manifest:`);
      logger.debug(manifest.toString());
      return serviceApi.createOrUpdateService(serviceName, manifest);
    });
};

export const createIngressRule = (name, type, datalabInfo, generator) => (service) => {
  const ingressName = `${type}-${name}`;
  const serviceName = service.metadata.name;
  const { port } = service.spec.ports[0];

  return generator({ name, datalabInfo, ingressName, serviceName, port })
    .then((manifest) => {
      logger.info(`Creating ingress rule ${chalk.blue(ingressName)} with manifest:`);
      logger.debug(manifest.toString());
      return ingressApi.createOrUpdateIngress(ingressName, manifest);
    });
};

export const createIngressRuleWithConnect = (params, generator) => (service) => {
  const { name, type, datalabInfo, rewriteTarget, proxyTimeout } = params;
  const ingressName = `${type}-${name}`;
  const serviceName = service.metadata.name;
  const { port } = service.spec.ports[0];
  const connectPort = service.spec.ports[1].port;

  return generator({ name, datalabInfo, ingressName, serviceName, port, connectPort, rewriteTarget, proxyTimeout })
    .then((manifest) => {
      logger.info(`Creating ingress rule ${chalk.blue(ingressName)} with connect port from manifest:`);
      logger.debug(manifest.toString());
      return ingressApi.createOrUpdateIngress(ingressName, manifest);
    });
};

export const createPersistentVolume = (name, volumeSize, generator) => () => {
  const volumeName = `${name}-claim`;

  return generator(volumeName, volumeSize)
    .then((manifest) => {
      logger.info(`Creating persistent volume ${chalk.blue(volumeName)} with manifest:`);
      logger.debug(manifest.toString());
      return volumeApi.createOrUpdatePersistentVolumeClaim(volumeName, manifest);
    });
};
