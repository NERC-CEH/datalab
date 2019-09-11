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

function createZeppelinStack(params) {
  const { projectKey, name, type } = params;
  const secretStrategy = secretManager.createNewUserCredentials;

  return secretManager.storeCredentialsInVault(projectKey, name, secretStrategy)
    .then(generateNewShiroIni)
    .then(secret => k8sSecretApi.createOrUpdateSecret(`${type}-${name}`, secret))
    .then(createDeployment(params, deploymentGenerator.createZeppelinDeployment))
    .then(createService(name, type, deploymentGenerator.createZeppelinService))
    .then(createIngressRuleWithConnect(params, ingressGenerator.createIngress));
}

function deleteZeppelinStack(params) {
  const { datalabInfo, projectKey, name, type } = params;
  const k8sName = `${type}-${name}`;

  return ingressApi.deleteIngress(k8sName, datalabInfo)
    .then(() => serviceApi.deleteService(k8sName))
    .then(() => deploymentApi.deleteDeployment(k8sName))
    .then(() => k8sSecretApi.deleteSecret(k8sName))
    .then(() => secretManager.deleteSecret(projectKey, name));
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
