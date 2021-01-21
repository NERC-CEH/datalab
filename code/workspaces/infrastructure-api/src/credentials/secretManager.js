import vault from './vault';
import tokenGenerator from './tokenGenerator';
import metadataGenerators from '../common/metadataGenerators';
import k8sSecretApi from '../kubernetes/secretApi';
import nameGenerators from '../common/nameGenerators';

function createNewJupyterCredentials() {
  return {
    token: tokenGenerator.generateUUID(),
  };
}

function createNewMinioCredentials() {
  return {
    access_key: tokenGenerator.generateUUID(),
    secret_key: tokenGenerator.generateUUID(),
  };
}

function createNewUserCredentials() {
  return {
    username: 'datalab',
    password: tokenGenerator.generateUUID(),
  };
}

function storeCredentialsInVault(projectKey, id, secret) {
  return vault.ensureSecret(`${projectKey}/stacks/${id}`, secret);
}

function createStackCredentialSecret(stackName, stackType, projectKey, credentials) {
  const secretName = nameGenerators.stackCredentialSecret(stackName, stackType);
  const additionalMetadataForSecret = metadataGenerators.stackSecretMetadata();
  return k8sSecretApi.createOrUpdateSecret(secretName, projectKey, credentials, additionalMetadataForSecret);
}

function deleteStackCredentialSecret(stackName, stackType, projectKey) {
  const secretName = nameGenerators.stackCredentialSecret(stackName, stackType);
  return k8sSecretApi.deleteSecret(secretName, projectKey);
}

function deleteSecret(projectKey, id) {
  return vault.deleteSecret(`${projectKey}/stacks/${id}`);
}

function storeMinioCredentialsInVault(projectKey, id, strategy) {
  return vault.ensureSecret(`${projectKey}/storage/${id}`, strategy);
}

function deleteMinioCredentials(projectKey, id) {
  return vault.deleteSecret(`${projectKey}/storage/${id}`);
}

export default {
  createNewJupyterCredentials,
  createNewMinioCredentials,
  createNewUserCredentials,
  storeCredentialsInVault,
  deleteSecret,
  storeMinioCredentialsInVault,
  deleteMinioCredentials,
  createStackCredentialSecret,
  deleteStackCredentialSecret,
};
