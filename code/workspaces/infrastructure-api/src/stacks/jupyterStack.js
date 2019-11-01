import secretManager from '../credentials/secretManager';
import k8sSecretApi from '../kubernetes/secretApi';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import ingressGenerator from '../kubernetes/ingressGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressApi from '../kubernetes/ingressApi';
import { createDeployment, createService, createSparkDriverHeadlessService, createIngressRule, getSparkDriverHeadlessServiceName } from './stackBuilders';

function createJupyterNotebook(params) {
  const { projectKey, name, type } = params;
  const secretStrategy = secretManager.createNewJupyterCredentials;

  return secretManager.storeCredentialsInVault(projectKey, name, secretStrategy)
    .then(secret => k8sSecretApi.createOrUpdateSecret(`${type}-${name}`, projectKey, secret))
    .then(createConfigMap(params, deploymentGenerator.createJupyterConfigMap))
    .then(createDeployment(params, deploymentGenerator.createJupyterDeployment))
    .then(createService(params, deploymentGenerator.createJupyterService))
    .then(createSparkDriverHeadlessService(params))
    .then(createIngressRule(params, ingressGenerator.createIngress));
}

function deleteJupyterNotebook(params) {
  const { projectKey, name, type } = params;
  const k8sName = `${type}-${name}`;

  return ingressApi.deleteIngress(k8sName, projectKey)
    .then(() => serviceApi.deleteService(k8sName, projectKey))
    .then(() => serviceApi.deleteService(getSparkDriverHeadlessServiceName(k8sName), projectKey))
    .then(() => deploymentApi.deleteDeployment(k8sName, projectKey))
    .then(() => k8sSecretApi.deleteSecret(k8sName, projectKey))
    .then(() => secretManager.deleteSecret(projectKey, name));
}

export default { createJupyterNotebook, deleteJupyterNotebook };
