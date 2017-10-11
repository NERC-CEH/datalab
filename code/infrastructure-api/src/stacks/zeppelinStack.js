import secretManager from '../credentials/secretManager';
import k8sSecretApi from '../kubernetes/secretApi';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import { generateManifest, ConfigTemplates } from '../kubernetes/manifestGenerator';
import zeppelinShiroGenerator from '../credentials/zeppelinShiroGenerator';
import proxyRouteApi from '../kong/proxyRouteApi';

import { createDeployment, createService, createProxyRouteWithConnect } from './stackBuilders';

function createZeppelinStack(params) {
  const { datalabInfo, name, type } = params;
  const secretStrategy = secretManager.createNewUserCredentials;

  return secretManager.storeCredentialsInVault(datalabInfo.name, name, secretStrategy)
    .then(generateNewShiroIni)
    .then(secret => k8sSecretApi.createOrUpdateSecret(`${type}-${name}`, secret))
    .then(createDeployment(params, deploymentGenerator.createZeppelinDeployment))
    .then(createService(name, type, deploymentGenerator.createZeppelinService))
    .then(createProxyRouteWithConnect(name, datalabInfo));
}

function deleteZeppelinStack({ datalabInfo, name, type }) {
  const k8sName = `${type}-${name}`;
  return proxyRouteApi.deleteRouteWithConnect(name, datalabInfo)
    .then(() => serviceApi.deleteService(k8sName))
    .then(() => deploymentApi.deleteDeployment(k8sName))
    .then(() => k8sSecretApi.deleteSecret(k8sName))
    .then(() => secretManager.deleteSecret(datalabInfo.name, name));
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
