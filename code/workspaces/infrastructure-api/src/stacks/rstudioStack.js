import secretManager from '../credentials/secretManager';
import k8sSecretApi from '../kubernetes/secretApi';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressGenerator from '../kubernetes/ingressGenerator';
import ingressApi from '../kubernetes/ingressApi';
import { createDeployment, createService, createIngressRuleWithConnect } from './stackBuilders';
import nameGenerators from '../common/nameGenerators';
import metadataGenerators from '../common/metadataGenerators';

function createRStudioStack(params) {
  const { projectKey, name, type } = params;
  const credentials = secretManager.createNewUserCredentials();
  const secretName = nameGenerators.stackCredentialSecret(name, type);
  const additionalMetadataForSecret = metadataGenerators.stackSecretMetadata();
  const proxyTimeout = '1800';

  return k8sSecretApi.createOrUpdateSecret(secretName, projectKey, credentials, additionalMetadataForSecret)
    .then(createDeployment(params, deploymentGenerator.createRStudioDeployment))
    .then(createService(params, deploymentGenerator.createRStudioService))
    .then(createIngressRuleWithConnect({ ...params, proxyTimeout }, ingressGenerator.createIngress));
}

function deleteRStudioStack(params) {
  const { projectKey, name, type } = params;
  const k8sName = nameGenerators.deploymentName(name, type);
  const secretName = nameGenerators.stackCredentialSecret(name, type);

  return ingressApi.deleteIngress(k8sName, projectKey)
    .then(() => serviceApi.deleteService(k8sName, projectKey))
    .then(() => deploymentApi.deleteDeployment(k8sName, projectKey))
    .then(() => k8sSecretApi.deleteSecret(secretName, projectKey));
}

export default { createRStudioStack, deleteRStudioStack };
