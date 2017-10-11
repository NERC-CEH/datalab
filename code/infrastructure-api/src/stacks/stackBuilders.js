import logger from 'winston';
import chalk from 'chalk';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import proxyRouteApi from '../kong/proxyRouteApi';

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

export const createProxyRoute = (name, datalabInfo) => (service) => {
  const k8sPort = service.spec.ports[0].nodePort;
  logger.info(`Creating Proxy Route for: '${name}' for k8s port: ${k8sPort}`);
  return proxyRouteApi.createOrUpdateRoute(name, datalabInfo, k8sPort);
};

export const createProxyRouteWithConnect = (name, datalabInfo) => (service) => {
  const k8sServicePort = service.spec.ports[0].nodePort;
  const k8sConnectPort = service.spec.ports[1].nodePort;

  logger.info(`Creating Proxy Routes for: '${name}' for k8s port: ${k8sServicePort} and connect port: ${k8sConnectPort}`);
  return proxyRouteApi.createOrUpdateRoute(name, datalabInfo, k8sServicePort)
    .then(() => proxyRouteApi.createOrUpdateRoute(name, datalabInfo, k8sConnectPort, true));
};
