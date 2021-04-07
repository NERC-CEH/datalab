import secretManager from '../credentials/secretManager';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import ingressGenerator from '../kubernetes/ingressGenerator';
import nameGenerator from '../common/nameGenerators';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressApi from '../kubernetes/ingressApi';
import {
  createDaskConfigMap,
  createDeployment,
  createIngressRule,
  createJupyterConfigMap,
  createPySparkConfigMap,
  createService,
  createSparkDriverHeadlessService,
} from './stackBuilders';
import configMapApi from '../kubernetes/configMapApi';

function createJupyterNotebook(params) {
  const { projectKey, name, type } = params;
  const credentials = secretManager.createNewJupyterCredentials();

  return secretManager.createStackCredentialSecret(name, type, projectKey, credentials)
    .then(createPySparkConfigMap(params))
    .then(createDaskConfigMap(params))
    .then(createJupyterConfigMap(params))
    .then(createDeployment(params, deploymentGenerator.createJupyterDeployment))
    .then(createSparkDriverHeadlessService(params))
    .then(createService(params, deploymentGenerator.createJupyterService))
    .then(createIngressRule(params, ingressGenerator.createIngress));
}

function deleteJupyterNotebook(params) {
  const { projectKey, name, type } = params;
  const k8sName = nameGenerator.deploymentName(name, type);

  return ingressApi.deleteIngress(k8sName, projectKey)
    .then(() => serviceApi.deleteService(k8sName, projectKey))
    .then(() => serviceApi.deleteService(nameGenerator.sparkDriverHeadlessService(k8sName), projectKey))
    .then(() => deploymentApi.deleteDeployment(k8sName, projectKey))
    .then(() => configMapApi.deleteNamespacedConfigMap(nameGenerator.daskConfigMap(k8sName), projectKey))
    .then(() => configMapApi.deleteNamespacedConfigMap(nameGenerator.pySparkConfigMap(k8sName), projectKey))
    .then(() => secretManager.deleteStackCredentialSecret(name, type, projectKey));
}

export default { createJupyterNotebook, deleteJupyterNotebook };
