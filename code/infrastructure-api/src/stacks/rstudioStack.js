import secretManager from '../credentials/secretManager';
import k8sSecretApi from '../kubernetes/secretApi';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import proxyRouteApi from '../kong/proxyRouteApi';
import { createDeployment, createService, createProxyRouteWithConnect } from './stackBuilders';

function createRStudioStack(datalabInfo, name, type) {
  const secretStrategy = secretManager.createNewRStudioCredentials;

  return secretManager.storeCredentialsInVault(datalabInfo.name, name, secretStrategy)
    .then(secret => k8sSecretApi.createOrUpdateSecret(`${type}-${name}`, secret))
    .then(createDeployment(datalabInfo, name, type, deploymentGenerator.createRStudioDeployment))
    .then(createService(name, type, deploymentGenerator.createRStudioService))
    .then(createProxyRouteWithConnect(name, datalabInfo));
}

function deleteRStudioStack(datalabInfo, name, type) {
  const k8sName = `${type}-${name}`;
  return proxyRouteApi.deleteRouteWithConnect(name, datalabInfo)
    .then(() => serviceApi.deleteService(k8sName))
    .then(() => deploymentApi.deleteDeployment(k8sName))
    .then(() => k8sSecretApi.deleteSecret(k8sName))
    .then(() => secretManager.deleteSecret(datalabInfo.name, name));
}

export default { createRStudioStack, deleteRStudioStack };
