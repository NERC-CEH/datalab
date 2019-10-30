import secretManager from '../credentials/secretManager';
import k8sSecretApi from '../kubernetes/secretApi';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import ingressGenerator from '../kubernetes/ingressGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressApi from '../kubernetes/ingressApi';
import { createDeployment, createService, createIngressRule, getHeadlessServiceName } from './stackBuilders';

function createJupyterLab(params) {
  const { projectKey, name, type } = params;
  const secretStrategy = secretManager.createNewJupyterCredentials;

  return secretManager.storeCredentialsInVault(projectKey, name, secretStrategy)
    .then(secret => k8sSecretApi.createOrUpdateSecret(`${type}-${name}`, projectKey, secret))
    .then(createDeployment(params, deploymentGenerator.createJupyterlabDeployment))
    .then(createService(params, deploymentGenerator.createJupyterlabService))
    .then(createService({ ...params, name: getHeadlessServiceName(name) }, deploymentGenerator.createJupyterlabHeadlessService))
    .then(createIngressRule(params, ingressGenerator.createIngress));
}

function deleteJupyterLab(params) {
  const { projectKey, name, type } = params;
  const k8sName = `${type}-${name}`;

  return ingressApi.deleteIngress(k8sName, projectKey)
    .then(() => serviceApi.deleteService(k8sName, projectKey))
    .then(() => serviceApi.deleteService(getHeadlessServiceName(k8sName), projectKey))
    .then(() => deploymentApi.deleteDeployment(k8sName, projectKey))
    .then(() => k8sSecretApi.deleteSecret(k8sName, projectKey))
    .then(() => secretManager.deleteSecret(projectKey, name));
}

export default { createJupyterLab, deleteJupyterLab };
