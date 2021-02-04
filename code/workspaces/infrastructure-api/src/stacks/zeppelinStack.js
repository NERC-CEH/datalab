import secretManager from '../credentials/secretManager';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressGenerator from '../kubernetes/ingressGenerator';
import ingressApi from '../kubernetes/ingressApi';
import { ConfigTemplates, generateManifest } from '../kubernetes/manifestGenerator';
import zeppelinShiroGenerator from '../credentials/zeppelinShiroGenerator';

import { createDeployment, createIngressRuleWithConnect, createService } from './stackBuilders';
import nameGenerators from '../common/nameGenerators';

function createZeppelinStack(params) {
  const { projectKey, name, type } = params;
  const credentials = secretManager.createNewUserCredentials();

  return generateNewShiroIni(credentials)
    .then(shiroIni => secretManager.createStackCredentialSecret(name, type, projectKey, { ...shiroIni, ...credentials }))
    .then(createDeployment(params, deploymentGenerator.createZeppelinDeployment))
    .then(createService(params, deploymentGenerator.createZeppelinService))
    .then(createIngressRuleWithConnect(params, ingressGenerator.createIngress));
}

function deleteZeppelinStack(params) {
  const { projectKey, name, type } = params;
  const deploymentName = nameGenerators.deploymentName(name, type);

  return ingressApi.deleteIngress(deploymentName, projectKey)
    .then(() => serviceApi.deleteService(deploymentName, projectKey))
    .then(() => deploymentApi.deleteDeployment(deploymentName, projectKey))
    .then(() => secretManager.deleteStackCredentialSecret(name, type, projectKey));
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
