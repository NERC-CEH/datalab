import secretManager from '../credentials/secretManager';
import k8sSecretApi from '../kubernetes/secretApi';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressGenerator from '../kubernetes/ingressGenerator';
import ingressApi from '../kubernetes/ingressApi';
import { createDeployment, createService, createIngressRuleWithConnect } from './stackBuilders';

function createRStudioStack(params) {
  const { projectKey, name, type } = params;
  const secretStrategy = secretManager.createNewUserCredentials;
  const proxyTimeout = '1800';

  return secretManager.storeCredentialsInVault(projectKey, name, secretStrategy)
    .then(secret => k8sSecretApi.createOrUpdateSecret(`${type}-${name}`, projectKey, secret))
    .then(createDeployment(params, deploymentGenerator.createRStudioDeployment))
    .then(createService(params, deploymentGenerator.createRStudioService))
    .then(createIngressRuleWithConnect({ ...params, proxyTimeout }, ingressGenerator.createIngress));
}

function deleteRStudioStack(params) {
  const { projectKey, name, type } = params;
  const k8sName = `${type}-${name}`;

  return ingressApi.deleteIngress(k8sName, projectKey)
    .then(() => serviceApi.deleteService(k8sName, projectKey))
    .then(() => deploymentApi.deleteDeployment(k8sName, projectKey))
    .then(() => k8sSecretApi.deleteSecret(k8sName, projectKey))
    .then(() => secretManager.deleteSecret(projectKey, name));
}

export default { createRStudioStack, deleteRStudioStack };
