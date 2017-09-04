import logger from 'winston';
import secretManager from '../credentials/secretManager';
import k8sSecretApi from '../kubernetes/secretApi';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';

function createNotebook(datalabName, notebookName, notebookType) {
  logger.info(`Creating new ${notebookType} notebook with id: ${notebookName} for datalab: ${datalabName}`);
  const notebookCredentials = secretManager.createNewJupyterCredentials();

  return secretManager.storeCredentialsInVault(datalabName, notebookName, notebookCredentials)
    .then(() => k8sSecretApi.createOrUpdateSecret(`jupyter-${notebookName}`, notebookCredentials))
    .then(createNotebookDeployment(notebookName))
    .then(createNotebookService(notebookName));
}

const createNotebookDeployment = notebookName => () => {
  const datalab = {
    name: 'testlab',
    domain: 'test-datalabs.nerc.ac.uk',
    volume: 'testlab',
  };
  const deploymentName = `jupyter-${notebookName}`;

  return deploymentGenerator.createJupyterDeployment(datalab, deploymentName, notebookName)
    .then((manifest) => {
      logger.info('Deploying Notebook with manifest: ');
      logger.info(manifest.toString());
      return deploymentApi.createOrUpdateDeployment(deploymentName, manifest);
    });
};

const createNotebookService = notebookName => () => {
  const serviceName = `jupyter-${notebookName}`;
  return deploymentGenerator.createJupyterService(serviceName)
    .then((manifest) => {
      logger.info('Creating Notebook Service with manifest: ');
      logger.info(manifest.toString());
      return serviceApi.createOrUpdateService(serviceName, manifest);
    });
};

export default { createNotebook };
