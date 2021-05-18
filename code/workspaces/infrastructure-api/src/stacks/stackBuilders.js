import chalk from 'chalk';
import { stackTypes } from 'common';
import { join } from 'path';
import logger from '../config/logger';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import configMapApi from '../kubernetes/configMapApi';
import ingressApi from '../kubernetes/ingressApi';
import volumeApi from '../kubernetes/volumeApi';
import networkPolicyApi from '../kubernetes/networkPolicyApi';
import autoScalerApi from '../kubernetes/autoScalerApi';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import nameGenerator from '../common/nameGenerators';

const { basePath } = stackTypes;

export const createDeployment = (params, generator) => () => {
  const { name, projectKey, type } = params;
  const deploymentName = nameGenerator.deploymentName(name, type);

  return generator({ ...params, deploymentName })
    .then((manifest) => {
      logger.info(`Creating deployment ${chalk.blue(deploymentName)} with manifest:`);
      logger.debug(manifest.toString());
      return deploymentApi.createOrUpdateDeployment(deploymentName, projectKey, manifest);
    });
};

export const createService = (params, generator) => () => {
  const { name, projectKey, type } = params;
  const serviceName = nameGenerator.deploymentName(name, type);
  return generator({ ...params, serviceName })
    .then((manifest) => {
      logger.info(`Creating service ${chalk.blue(serviceName)} with manifest:`);
      logger.debug(manifest.toString());
      return serviceApi.createOrUpdateService(serviceName, projectKey, manifest);
    });
};

export const createSparkDriverHeadlessService = params => () => {
  const { name, projectKey, type } = params;
  const notebookServiceName = nameGenerator.deploymentName(name, type);
  const headlessServiceName = nameGenerator.sparkDriverHeadlessService(notebookServiceName);
  return deploymentGenerator.createSparkDriverHeadlessService({ serviceName: notebookServiceName })
    .then((manifest) => {
      logger.info(`Creating service ${chalk.blue(headlessServiceName)} with manifest:`);
      logger.debug(manifest.toString());
      return serviceApi.createOrUpdateService(headlessServiceName, projectKey, manifest);
    });
};

export const createPySparkConfigMap = params => async () => {
  const { name, projectKey, type } = params;

  const serviceName = nameGenerator.deploymentName(name, type);
  const configMapName = nameGenerator.pySparkConfigMap(serviceName);
  const manifest = await deploymentGenerator.createPySparkConfigMap(serviceName, projectKey, configMapName);

  logger.info(`Creating configMap ${chalk.blue(configMapName)} with manifest:`);
  logger.debug(manifest.toString());

  return configMapApi.createOrReplaceNamespacedConfigMap(configMapName, projectKey, manifest);
};

export const createDaskConfigMap = params => async () => {
  const { name, projectKey, type } = params;

  const serviceName = nameGenerator.deploymentName(name, type);
  const configMapName = nameGenerator.daskConfigMap(serviceName);
  const manifest = await deploymentGenerator.createDaskConfigMap(serviceName, projectKey, configMapName);

  logger.info(`Creating configMap ${chalk.blue(configMapName)} with manifest:`);
  logger.debug(manifest.toString());

  return configMapApi.createOrReplaceNamespacedConfigMap(configMapName, projectKey, manifest);
};

export const createJupyterConfigMap = params => async () => {
  const { name, projectKey, type } = params;

  const serviceName = nameGenerator.deploymentName(name, type);
  const configMapName = nameGenerator.jupyterConfigMap(serviceName);
  const manifest = await deploymentGenerator.createJupyterConfigMap(configMapName);

  logger.info(`Creating configMap ${chalk.blue(configMapName)} with manifest:`);
  logger.debug(manifest.toString());

  return configMapApi.createOrReplaceNamespacedConfigMap(configMapName, projectKey, manifest);
};

export const createRStudioConfigMap = params => async () => {
  const { name, projectKey, type } = params;
  const base = basePath(type, projectKey, name);

  const serviceName = nameGenerator.deploymentName(name, type);
  const configMapName = nameGenerator.rStudioConfigMap(serviceName);
  const manifest = await deploymentGenerator.createRStudioConfigMap(configMapName, base);

  logger.info(`Creating configMap ${chalk.blue(configMapName)} with manifest:`);
  logger.debug(manifest.toString());

  return configMapApi.createOrReplaceNamespacedConfigMap(configMapName, projectKey, manifest);
};

export const ingressPath = (type, projectKey, name, pathPattern) => {
  const base = basePath(type, projectKey, name);
  return pathPattern ? `${base}${pathPattern}` : base;
};

export const ingressConnectPath = (type, projectKey, name, pathPattern) => {
  const base = basePath(type, projectKey, name);
  const connectBase = join(base, 'connect');
  return pathPattern ? `${connectBase}${pathPattern}` : connectBase;
};

export const createIngressRule = (params, generator) => (service) => {
  const { name, projectKey, type, pathPattern = null } = params;
  const ingressName = nameGenerator.deploymentName(name, type);
  const serviceName = service.metadata.name;
  const { port } = service.spec.ports[0];
  const path = ingressPath(type, projectKey, name, pathPattern);

  return generator({ ...params, ingressName, serviceName, port, path })
    .then((manifest) => {
      logger.info(`Creating ingress rule ${chalk.blue(ingressName)} with manifest:`);
      logger.debug(manifest.toString());
      ingressApi.createOrUpdateIngress(ingressName, projectKey, manifest);
      return service; // so can be used in additional ingresses
    });
};

// use if the connect rule needs to be in a separate ingress,
// e.g. because one ingress uses rewriteTarget
export const createConnectIngressRule = (params, generator) => (service) => {
  const { name, projectKey, type, pathPattern = null } = params;
  const ingressName = `${nameGenerator.deploymentName(name, type)}-connect`;
  const serviceName = service.metadata.name;
  const connectPort = service.spec.ports[1].port;
  const connectPath = ingressConnectPath(type, projectKey, name, pathPattern);

  return generator({ ...params, ingressName, serviceName, port: connectPort, path: connectPath })
    .then((manifest) => {
      logger.info(`Creating ingress rule ${chalk.blue(ingressName)} with manifest:`);
      logger.debug(manifest.toString());
      ingressApi.createOrUpdateIngress(ingressName, projectKey, manifest);
      return service; // so can be used in additional ingresses
    });
};

export const createIngressRuleWithConnect = (params, generator) => (service) => {
  const { name, projectKey, type, pathPattern = null } = params;
  const ingressName = nameGenerator.deploymentName(name, type);
  const serviceName = service.metadata.name;
  const { port } = service.spec.ports[0];
  const connectPort = service.spec.ports[1].port;
  const path = ingressPath(type, projectKey, name, pathPattern);
  const connectPath = ingressConnectPath(type, projectKey, name, pathPattern);

  return generator({ ...params, ingressName, serviceName, port, connectPort, path, connectPath })
    .then((manifest) => {
      logger.info(`Creating ingress rule ${chalk.blue(ingressName)} with connect port from manifest:`);
      logger.debug(manifest.toString());
      ingressApi.createOrUpdateIngress(ingressName, projectKey, manifest);
      return service; // so can be used in additional ingresses
    });
};

export const createPersistentVolume = (params, generator) => () => {
  const { name, volumeSize, projectKey, type } = params;
  const volumeName = nameGenerator.pvcName(name);

  return generator(volumeName, volumeSize, type)
    .then((manifest) => {
      logger.info(`Creating persistent volume ${chalk.blue(volumeName)} with manifest:`);
      logger.debug(manifest.toString());
      return volumeApi.createOrUpdatePersistentVolumeClaim(volumeName, projectKey, manifest);
    });
};

export const createNetworkPolicy = (params, generator) => () => {
  const { name, type, projectKey } = params;
  const networkPolicyName = nameGenerator.networkPolicyName(name, type);
  return generator({ ...params, networkPolicyName })
    .then((manifest) => {
      logger.info(`Creating network policy ${chalk.blue(networkPolicyName)} with manifest:`);
      logger.debug(manifest.toString());
      return networkPolicyApi.createOrUpdateNetworkPolicy(networkPolicyName, projectKey, manifest);
    });
};

export const createAutoScaler = (params, generator) => () => {
  const { name, type, projectKey } = params;
  const autoScalerName = nameGenerator.autoScalerName(name, type);
  const scaleDeploymentName = nameGenerator.deploymentName(name, type);
  return generator({ ...params, autoScalerName, scaleDeploymentName })
    .then((manifest) => {
      logger.info(`Creating pod auto-scaler ${chalk.blue(autoScalerName)} with manifest:`);
      logger.debug(manifest.toString());
      return autoScalerApi.createOrUpdateAutoScaler(autoScalerName, projectKey, manifest);
    });
};
