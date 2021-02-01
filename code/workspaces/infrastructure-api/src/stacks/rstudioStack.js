import secretManager from '../credentials/secretManager';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressGenerator from '../kubernetes/ingressGenerator';
import ingressApi from '../kubernetes/ingressApi';
import { createDeployment, createService, createIngressRuleWithConnect } from './stackBuilders';
import nameGenerators from '../common/nameGenerators';

function createRStudioStack(params) {
  const { projectKey, name, type } = params;
  const credentials = secretManager.createNewUserCredentials();
  const proxyTimeout = '1800';

  return secretManager.createStackCredentialSecret(name, type, projectKey, credentials)
    .then(createDeployment(params, deploymentGenerator.createRStudioDeployment))
    .then(createService(params, deploymentGenerator.createRStudioService))
    .then(createIngressRuleWithConnect({ ...params, proxyTimeout }, ingressGenerator.createIngress));
}

function deleteRStudioStack(params) {
  const { projectKey, name, type } = params;
  const k8sName = nameGenerators.deploymentName(name, type);

  return ingressApi.deleteIngress(k8sName, projectKey)
    .then(() => serviceApi.deleteService(k8sName, projectKey))
    .then(() => deploymentApi.deleteDeployment(k8sName, projectKey))
    .then(() => secretManager.deleteStackCredentialSecret(name, type, projectKey));
}

export default { createRStudioStack, deleteRStudioStack };
