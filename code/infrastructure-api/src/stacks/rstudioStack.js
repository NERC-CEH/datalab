import secretManager from '../credentials/secretManager';
import k8sSecretApi from '../kubernetes/secretApi';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressGenerator from '../kubernetes/ingressGenerator';
import ingressApi from '../kubernetes/ingressApi';
import { createDeployment, createService, createIngressRuleWithConnect } from './stackBuilders';

function createRStudioStack(params) {
  const { datalabInfo, name, type } = params;
  const secretStrategy = secretManager.createNewUserCredentials;
  const proxyTimeout = '1800';

  return secretManager.storeCredentialsInVault(datalabInfo.name, name, secretStrategy)
    .then(secret => k8sSecretApi.createOrUpdateSecret(`${type}-${name}`, secret))
    .then(createDeployment(params, deploymentGenerator.createRStudioDeployment))
    .then(createService(name, type, deploymentGenerator.createRStudioService))
    .then(createIngressRuleWithConnect({ datalabInfo, name, type, proxyTimeout }, ingressGenerator.createIngress));
}

function deleteRStudioStack(params) {
  const { datalabInfo, name, type } = params;
  const k8sName = `${type}-${name}`;

  return ingressApi.deleteIngress(k8sName, datalabInfo)
    .then(() => serviceApi.deleteService(k8sName))
    .then(() => deploymentApi.deleteDeployment(k8sName))
    .then(() => k8sSecretApi.deleteSecret(k8sName))
    .then(() => secretManager.deleteSecret(datalabInfo.name, name));
}

export default { createRStudioStack, deleteRStudioStack };
