import logger from 'winston';
import chalk from 'chalk';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import proxyRouteApi from '../kong/proxyRouteApi';

export const createDeployment = (datalabInfo, name, type, generator) => () => {
  const deploymentName = `${type}-${name}`;
  return generator(datalabInfo, deploymentName, name)
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

export const createProxyRoute = (notebookName, datalabInfo) => (service) => {
  const k8sPort = service.spec.ports[0].nodePort;
  logger.info(`Creating Proxy Route for: '${notebookName}' for k8s port: ${k8sPort}`);
  return proxyRouteApi.createOrUpdateRoute(notebookName, datalabInfo, k8sPort);
};
