import logger from 'winston';
import chalk from 'chalk';
import Stacks from './stacks';
import secretManager from '../credentials/secretManager';
import k8sSecretApi from '../kubernetes/secretApi';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import proxyRouteApi from '../kong/proxyRouteApi';

function createNotebook(datalabInfo, notebookName, notebookType) {
  const creationFunctions = {
    [Stacks.JUPYTER]: createJupyterNotebook,
    [Stacks.RSTUDIO]: createRStudioStack,
  };

  if (!creationFunctions[notebookType]) {
    logger.error(`Could not create stack. No stack definition for type ${notebookType}`);
    return Promise.reject({ message: `No stack definition for type ${notebookType}` });
  }

  logger.info(`Creating new ${notebookType} stack with name: ${notebookName} for datalab: ${datalabInfo.name}`);
  return creationFunctions[notebookType](datalabInfo, notebookName, notebookType);
}

function deleteNotebook(datalabInfo, name, type) {
  const deletionFunctions = {
    [Stacks.JUPYTER]: deleteJupyterNotebook,
    [Stacks.RSTUDIO]: deleteRStudioStack,
  };

  if (!deletionFunctions[type]) {
    logger.error(`Could not delete stack. No stack definition for type ${type}`);
    return Promise.reject({ message: `No stack definition for type ${type}` });
  }

  logger.info(`Deleting stack ${name} for datalab: ${datalabInfo.name}`);
  return deletionFunctions[type](datalabInfo, name, type);
}

function createJupyterNotebook(datalabInfo, notebookName, notebookType) {
  const secretStrategy = secretManager.createNewJupyterCredentials;

  return secretManager.storeCredentialsInVault(datalabInfo.name, notebookName, secretStrategy)
    .then(secret => k8sSecretApi.createOrUpdateSecret(`${notebookType}-${notebookName}`, secret))
    .then(createNotebookDeployment(notebookName, datalabInfo))
    .then(createNotebookService(notebookName))
    .then(createProxyRoute(notebookName, datalabInfo));
}

function deleteJupyterNotebook(datalabInfo, notebookName, notebookType) {
  const k8sName = `${notebookType}-${notebookName}`;
  return proxyRouteApi.deleteRoute(notebookName, datalabInfo)
    .then(() => serviceApi.deleteService(k8sName))
    .then(() => deploymentApi.deleteDeployment(k8sName))
    .then(() => k8sSecretApi.deleteSecret(k8sName))
    .then(() => secretManager.deleteSecret(datalabInfo.name, notebookName));
}

function createRStudioStack(datalabInfo, name, type) {
  return createDeployment(datalabInfo, name, type, deploymentGenerator.createRStudioDeployment)()
    .then(createService(name, type, deploymentGenerator.createRStudioService))
    .then(createProxyRoute(name, datalabInfo));
}

function deleteRStudioStack(datalabInfo, name, type) {
  const k8sName = `${type}-${name}`;
  return proxyRouteApi.deleteRoute(name, datalabInfo)
    .then(() => serviceApi.deleteService(k8sName))
    .then(() => deploymentApi.deleteDeployment(k8sName));
}

const createDeployment = (datalabInfo, name, type, generator) => () => {
  const deploymentName = `${type}-${name}`;
  return generator(datalabInfo, deploymentName, name)
    .then((manifest) => {
      logger.info(`Creating deployment ${chalk.blue(deploymentName)} with manifest:`);
      logger.debug(manifest.toString());
      return deploymentApi.createOrUpdateDeployment(deploymentName, manifest);
    });
};

const createService = (name, type, generator) => () => {
  const serviceName = `${type}-${name}`;
  return generator(serviceName)
    .then((manifest) => {
      logger.info(`Creating service ${chalk.blue(serviceName)} with manifest:`);
      logger.debug(manifest.toString());
      return serviceApi.createOrUpdateService(serviceName, manifest);
    });
};

const createNotebookDeployment = (notebookName, datalabInfo) => () => {
  const deploymentName = `jupyter-${notebookName}`;
  return deploymentGenerator.createJupyterDeployment(datalabInfo, deploymentName, notebookName)
    .then((manifest) => {
      logger.info(`Deploying Notebook with manifest: ${deploymentName}`);
      logger.debug(manifest.toString());
      return deploymentApi.createOrUpdateDeployment(deploymentName, manifest);
    });
};

const createNotebookService = notebookName => () => {
  const serviceName = `jupyter-${notebookName}`;
  return deploymentGenerator.createJupyterService(serviceName)
    .then((manifest) => {
      logger.info(`Creating Notebook Service with manifest: ${serviceName}`);
      logger.debug(manifest.toString());
      return serviceApi.createOrUpdateService(serviceName, manifest);
    });
};

const createProxyRoute = (notebookName, datalabInfo) => (service) => {
  const k8sPort = service.spec.ports[0].nodePort;
  logger.info(`Creating Proxy Route for: '${notebookName}' for k8s port: ${k8sPort}`);
  return proxyRouteApi.createOrUpdateRoute(notebookName, datalabInfo, k8sPort);
};

export default { createNotebook, deleteNotebook };
