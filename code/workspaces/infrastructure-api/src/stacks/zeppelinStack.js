import secretManager from '../credentials/secretManager';
import k8sSecretApi from '../kubernetes/secretApi';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressGenerator from '../kubernetes/ingressGenerator';
import ingressApi from '../kubernetes/ingressApi';
import { generateManifest, ConfigTemplates } from '../kubernetes/manifestGenerator';
import zeppelinShiroGenerator from '../credentials/zeppelinShiroGenerator';

import { createDeployment, createService, createIngressRuleWithConnect } from './stackBuilders';
import nameGenerators from '../common/nameGenerators';
import metadataGenerators from '../common/metadataGenerators';

function createZeppelinStack(params) {
  const { projectKey, name, type } = params;
  const credentials = secretManager.createNewUserCredentials();
  const secretName = nameGenerators.stackCredentialSecret(name, type);
  const additionalMetadataForSecret = metadataGenerators.stackSecretMetadata();

  return generateNewShiroIni(credentials)
    .then(shiroIni => k8sSecretApi.createOrUpdateSecret(secretName, projectKey, { ...shiroIni, ...credentials }, additionalMetadataForSecret))
    .then(createDeployment(params, deploymentGenerator.createZeppelinDeployment))
    .then(createService(params, deploymentGenerator.createZeppelinService))
    .then(createIngressRuleWithConnect(params, ingressGenerator.createIngress));
}

function deleteZeppelinStack(params) {
  const { projectKey, name, type } = params;
  const deploymentName = nameGenerators.deploymentName(name, type);
  const secretName = nameGenerators.stackCredentialSecret(name, type);

  return ingressApi.deleteIngress(deploymentName, projectKey)
    .then(() => serviceApi.deleteService(deploymentName, projectKey))
    .then(() => deploymentApi.deleteDeployment(deploymentName, projectKey))
    .then(() => k8sSecretApi.deleteSecret(secretName, projectKey));
}

function generateNewShiroIni(credentials) {
  const shiroCredentials = zeppelinShiroGenerator.generateNewShiroCredentials(credentials.password);

  const context = {
    username: credentials.username,
    encryptedPassword: shiroCredentials.shiroCredentials,
  };

  return generateManifest(context, ConfigTemplates.ZEPPELIN_CONFIG)
    .then(body => ({ 'shiro.ini': body }));
}

export default { createZeppelinStack, deleteZeppelinStack };
