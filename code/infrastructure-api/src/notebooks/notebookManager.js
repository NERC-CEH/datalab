import logger from 'winston';
import secretManager from '../credentials/secretManager';
import k8sSecretApi from '../kubernetes/secretApi';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import proxyRouteApi from '../kong/proxyRouteApi';

function createNotebook(datalabInfo, notebookName, notebookType) {
  logger.info(`Creating new ${notebookType} notebook with id: ${notebookName} for datalab: ${datalabInfo.name}`);
  const notebookCredentials = secretManager.createNewJupyterCredentials();

  return secretManager.storeCredentialsInVault(datalabInfo.name, notebookName, notebookCredentials)
    .then(() => k8sSecretApi.createOrUpdateSecret(`jupyter-${notebookName}`, notebookCredentials))
    .then(createNotebookDeployment(notebookName, datalabInfo))
    .then(createNotebookService(notebookName))
    .then(createProxyRoute(notebookName, datalabInfo));
}

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

export default { createNotebook };
