import secretManager from '../credentials/secretManager';
import k8sSecretApi from '../kubernetes/secretApi';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import ingressGenerator from '../kubernetes/ingressGenerator';
import nameGenerator from '../common/nameGenerators';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressApi from '../kubernetes/ingressApi';
import {
  createDeployment,
  createService,
  createSparkDriverHeadlessService,
  createIngressRule,
  createPySparkConfigMap,
} from './stackBuilders';
import configMapApi from '../kubernetes/configMapApi';

function createJupyterNotebook(params) {
  const { projectKey, name, type } = params;
  const secretStrategy = secretManager.createNewJupyterCredentials;

  return secretManager.storeCredentialsInVault(projectKey, name, secretStrategy)
    .then(secret => k8sSecretApi.createOrUpdateSecret(nameGenerator.deploymentName(name, type), projectKey, secret))
    .then(createPySparkConfigMap(params))
    .then(createDeployment(params, deploymentGenerator.createJupyterDeployment))
    .then(createService(params, deploymentGenerator.createJupyterService))
    .then(createSparkDriverHeadlessService(params))
    .then(createIngressRule(params, ingressGenerator.createIngress));
}

function deleteJupyterNotebook(params) {
  const { projectKey, name, type } = params;
  const k8sName = nameGenerator.deploymentName(name, type);

  return ingressApi.deleteIngress(k8sName, projectKey)
    .then(() => serviceApi.deleteService(k8sName, projectKey))
    .then(() => serviceApi.deleteService(nameGenerator.sparkDriverHeadlessService(k8sName), projectKey))
    .then(() => deploymentApi.deleteDeployment(k8sName, projectKey))
    .then(() => configMapApi.deleteNamespacedConfigMap(nameGenerator.pySparkConfigMap(k8sName), projectKey))
    .then(() => k8sSecretApi.deleteSecret(k8sName, projectKey))
    .then(() => secretManager.deleteSecret(projectKey, name));
}

export default { createJupyterNotebook, deleteJupyterNotebook };
