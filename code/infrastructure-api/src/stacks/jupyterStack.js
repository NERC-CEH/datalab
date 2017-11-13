import secretManager from '../credentials/secretManager';
import k8sSecretApi from '../kubernetes/secretApi';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import ingressGenerator from '../kubernetes/ingressGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressApi from '../kubernetes/ingressApi';
import { createDeployment, createService, createIngressRule } from './stackBuilders';

function createJupyterNotebook(params) {
  const { datalabInfo, name, type } = params;
  const secretStrategy = secretManager.createNewJupyterCredentials;

  return secretManager.storeCredentialsInVault(datalabInfo.name, name, secretStrategy)
    .then(secret => k8sSecretApi.createOrUpdateSecret(`${type}-${name}`, secret))
    .then(createDeployment(params, deploymentGenerator.createJupyterDeployment))
    .then(createService(name, type, deploymentGenerator.createJupyterService))
    .then(createIngressRule(name, type, datalabInfo, ingressGenerator.createIngress));
}

function deleteJupyterNotebook(params) {
  const { datalabInfo, name, type } = params;
  const k8sName = `${type}-${name}`;

  return ingressApi.deleteIngress(k8sName, datalabInfo)
    .then(() => serviceApi.deleteService(k8sName))
    .then(() => deploymentApi.deleteDeployment(k8sName))
    .then(() => k8sSecretApi.deleteSecret(k8sName))
    .then(() => secretManager.deleteSecret(datalabInfo.name, name));
}

export default { createJupyterNotebook, deleteJupyterNotebook };
