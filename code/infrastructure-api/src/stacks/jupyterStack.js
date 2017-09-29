import secretManager from '../credentials/secretManager';
import k8sSecretApi from '../kubernetes/secretApi';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import proxyRouteApi from '../kong/proxyRouteApi';
import { createDeployment, createService, createProxyRoute } from './stackBuilders';

function createJupyterNotebook(datalabInfo, name, type) {
  const secretStrategy = secretManager.createNewJupyterCredentials;

  return secretManager.storeCredentialsInVault(datalabInfo.name, name, secretStrategy)
    .then(secret => k8sSecretApi.createOrUpdateSecret(`${type}-${name}`, secret))
    .then(createDeployment(datalabInfo, name, type, deploymentGenerator.createJupyterDeployment))
    .then(createService(name, type, deploymentGenerator.createJupyterService))
    .then(createProxyRoute(name, datalabInfo));
}

function deleteJupyterNotebook(datalabInfo, notebookName, notebookType) {
  const k8sName = `${notebookType}-${notebookName}`;
  return proxyRouteApi.deleteRoute(notebookName, datalabInfo)
    .then(() => serviceApi.deleteService(k8sName))
    .then(() => deploymentApi.deleteDeployment(k8sName))
    .then(() => k8sSecretApi.deleteSecret(k8sName))
    .then(() => secretManager.deleteSecret(datalabInfo.name, notebookName));
}

export default { createJupyterNotebook, deleteJupyterNotebook };
