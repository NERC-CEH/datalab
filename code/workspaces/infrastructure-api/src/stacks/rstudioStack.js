import secretManager from '../credentials/secretManager';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressGenerator from '../kubernetes/ingressGenerator';
import ingressApi from '../kubernetes/ingressApi';
import { createDeployment, createService, createIngressRule, createConnectIngressRule, createRStudioConfigMap } from './stackBuilders';
import nameGenerators from '../common/nameGenerators';
import configMapApi from '../kubernetes/configMapApi';

function createRStudioStack(params) {
  const { projectKey, name, type } = params;
  const credentials = secretManager.createNewUserCredentials();
  const proxyTimeout = '1800';
  const rewriteTarget = '/$2';
  const pathPattern = '(/|$)(.*)';
  const deploymentName = nameGenerators.deploymentName(name, type);
  const proxyHeadersConfigMap = nameGenerators.rStudioConfigMap(deploymentName);

  return secretManager.createStackCredentialSecret(name, type, projectKey, credentials)
    .then(createRStudioConfigMap(params))
    .then(createDeployment(params, deploymentGenerator.createRStudioDeployment))
    .then(createService(params, deploymentGenerator.createRStudioService))
    .then(createIngressRule({ ...params, proxyTimeout, rewriteTarget, pathPattern, proxyHeadersConfigMap }, ingressGenerator.createIngress))
    // Note - the pathPattern is required, even though there's no rewriteTarget
    // in order to ensure the connect path is long enough to be matched before the main service
    .then(createConnectIngressRule({ ...params, proxyTimeout, pathPattern }, ingressGenerator.createIngress));
}

function deleteRStudioStack(params) {
  const { projectKey, name, type } = params;
  const k8sName = nameGenerators.deploymentName(name, type);
  const connectK8sName = `${k8sName}-connect`;

  return ingressApi.deleteIngress(connectK8sName, projectKey)
    .then(() => ingressApi.deleteIngress(k8sName, projectKey))
    .then(() => serviceApi.deleteService(k8sName, projectKey))
    .then(() => deploymentApi.deleteDeployment(k8sName, projectKey))
    .then(() => configMapApi.deleteNamespacedConfigMap(nameGenerators.rStudioConfigMap(k8sName), projectKey))
    .then(() => secretManager.deleteStackCredentialSecret(name, type, projectKey));
}

export default { createRStudioStack, deleteRStudioStack };
