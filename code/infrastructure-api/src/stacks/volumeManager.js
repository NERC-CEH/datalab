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

const type = 'minio';

function createVolume(params) {
  const { datalabInfo, name, volumeSize } = params;
  const secretStrategy = secretManager.createNewMinioCredentials;

  return secretManager.storeMinioCredentialsInVault(datalabInfo.name, name, secretStrategy)
    .then(secret => k8sSecretApi.createOrUpdateSecret(`${type}-${name}`, secret))
    .then(createPersistentVolume(name, volumeSize, volumeGenerator.createVolume))
    .then(createDeployment({ ...params, type }, deploymentGenerator.createMinioDeployment))
    .then(createService(name, type, deploymentGenerator.createMinioService))
    .then(createIngressRuleWithConnect(name, type, datalabInfo, ingressGenerator.createIngress));
}

function deleteVolume(params) {
  const { datalabInfo, name } = params;
  const k8sName = `${type}-${name}`;

  return ingressApi.deleteIngress(k8sName, datalabInfo)
    .then(() => serviceApi.deleteService(k8sName))
    .then(() => deploymentApi.deleteDeployment(k8sName))
    .then(() => volumeApi.deletePersistentVolumeClaim(`${name}-claim`))
    .then(() => k8sSecretApi.deleteSecret(k8sName))
    .then(() => secretManager.deleteMinioCredentials(datalabInfo.name, name));
}

function listVolumes() {
  return volumeApi.listPersistentVolumeClaims();
}

export default { createVolume, deleteVolume, listVolumes };
