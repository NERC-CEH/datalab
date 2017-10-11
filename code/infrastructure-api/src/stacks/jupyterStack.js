import secretManager from '../credentials/secretManager';
import k8sSecretApi from '../kubernetes/secretApi';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import proxyRouteApi from '../kong/proxyRouteApi';
import { createDeployment, createService, createProxyRoute } from './stackBuilders';

function createJupyterNotebook(params) {
  const { datalabInfo, name, type } = params;
  const secretStrategy = secretManager.createNewJupyterCredentials;

  return secretManager.storeCredentialsInVault(datalabInfo.name, name, secretStrategy)
    .then(secret => k8sSecretApi.createOrUpdateSecret(`${type}-${name}`, secret))
    .then(createDeployment(params, deploymentGenerator.createJupyterDeployment))
    .then(createService(name, type, deploymentGenerator.createJupyterService))
    .then(createProxyRoute(name, datalabInfo));
}

function deleteJupyterNotebook(params) {
  const { datalabInfo, name, type } = params;
  const k8sName = `${type}-${name}`;

  return proxyRouteApi.deleteRoute(name, datalabInfo)
    .then(() => serviceApi.deleteService(k8sName))
    .then(() => deploymentApi.deleteDeployment(k8sName))
    .then(() => k8sSecretApi.deleteSecret(k8sName))
    .then(() => secretManager.deleteSecret(datalabInfo.name, name));
}

export default { createJupyterNotebook, deleteJupyterNotebook };
