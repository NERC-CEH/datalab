import secretManager from '../credentials/secretManager';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import ingressGenerator from '../kubernetes/ingressGenerator';
import nameGenerator from '../common/nameGenerators';
import deploymentApi from '../kubernetes/deploymentApi';
import serviceApi from '../kubernetes/serviceApi';
import ingressApi from '../kubernetes/ingressApi';
import {
  createDeployment,
  createIngressRule,
  createService,
} from './stackBuilders';

function createVSCode(params) {
  const { projectKey, name, type } = params;
  const credentials = secretManager.createNewVSCodeCredentials();

  return secretManager.createStackCredentialSecret(name, type, projectKey, credentials)
    .then(createDeployment(params, deploymentGenerator.createVSCodeDeployment))
    .then(createService(params, deploymentGenerator.createVSCodeService))
    .then(createIngressRule(params, ingressGenerator.createIngress));
}

function deleteVSCode(params) {
  const { projectKey, name, type } = params;
  const k8sName = nameGenerator.deploymentName(name, type);

  return ingressApi.deleteIngress(k8sName, projectKey)
    .then(() => serviceApi.deleteService(k8sName, projectKey))
    .then(() => deploymentApi.deleteDeployment(k8sName, projectKey))
    .then(() => secretManager.deleteStackCredentialSecret(name, type, projectKey));
}

export default { createVSCode, deleteVSCode };
