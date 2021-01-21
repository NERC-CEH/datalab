import volumeApi from '../kubernetes/volumeApi';
import volumeGenerator from '../kubernetes/volumeGenerator';
import secretManager from '../credentials/secretManager';
import k8sSecretApi from '../kubernetes/secretApi';
import serviceApi from '../kubernetes/serviceApi';
import deploymentApi from '../kubernetes/deploymentApi';
import deploymentGenerator from '../kubernetes/deploymentGenerator';
import ingressGenerator from '../kubernetes/ingressGenerator';
import ingressApi from '../kubernetes/ingressApi';
import { createPersistentVolume, createDeployment, createService, createIngressRuleWithConnect } from './stackBuilders';
import metadataGenerators from '../common/metadataGenerators';
import nameGenerators from '../common/nameGenerators';

const type = 'minio';

async function createVolume(user, params) {
  await createVolumeStack(params);
}

async function deleteVolume(params) {
  await deleteVolumeStack(params);
}

async function createVolumeStack(params) {
  const { projectKey, name } = params;
  const credentials = secretManager.createNewMinioCredentials();
  const secretName = nameGenerators.stackCredentialSecret(name, type);
  const additionalMetadataForSecret = metadataGenerators.stackSecretMetadata();
  const rewriteTarget = '/';
  const proxyRequestBuffering = 'off';

  return k8sSecretApi.createOrUpdateSecret(secretName, projectKey, credentials, additionalMetadataForSecret)
    .then(createPersistentVolume(params, volumeGenerator.createVolume))
    // Note the override of 'type' in the params object below.
    // This is due to the fact it is passed as an int but must be the string value for volume type in the kubernetes resources
    // This will not work if there is more than one volume type.
    // The best fix is to store the type string in the database to avoid the mapping.
    .then(createDeployment({ ...params, type }, deploymentGenerator.createMinioDeployment))
    .then(createService({ ...params, type }, deploymentGenerator.createMinioService))
    .then(createIngressRuleWithConnect({ ...params, type, rewriteTarget, proxyRequestBuffering }, ingressGenerator.createIngress));
}

function deleteVolumeStack(params) {
  // Deletion of PVC is blocked to prevent breaking pods.
  const { projectKey, name } = params;
  const deploymentName = nameGenerators.deploymentName(name, type);
  const secretName = nameGenerators.stackCredentialSecret(name, type);

  return ingressApi.deleteIngress(deploymentName, projectKey)
    .then(() => serviceApi.deleteService(deploymentName, projectKey))
    .then(() => deploymentApi.deleteDeployment(deploymentName, projectKey))
    // .then(() => volumeApi.deletePersistentVolumeClaim(`${name}-claim`))
    .then(() => k8sSecretApi.deleteSecret(secretName, projectKey));
}

function queryVolume(params) {
  const { name } = params;

  return volumeApi.queryPersistentVolumeClaim(`${name}-claim`);
}

export default { createVolume, deleteVolume, queryVolume };
