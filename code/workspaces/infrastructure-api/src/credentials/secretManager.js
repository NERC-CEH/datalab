import tokenGenerator from './tokenGenerator';
import metadataGenerators from '../common/metadataGenerators';
import k8sSecretApi from '../kubernetes/secretApi';
import nameGenerators from '../common/nameGenerators';

function createNewVSCodeCredentials() {
  return {
    token: tokenGenerator.generateUUID(),
  };
}

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

function createStackCredentialSecret(stackName, stackType, projectKey, credentials) {
  const secretName = nameGenerators.stackCredentialSecret(stackName, stackType);
  const additionalMetadataForSecret = metadataGenerators.stackSecretMetadata();
  return k8sSecretApi.createOrUpdateSecret(secretName, projectKey, credentials, additionalMetadataForSecret);
}

function deleteStackCredentialSecret(stackName, stackType, projectKey) {
  const secretName = nameGenerators.stackCredentialSecret(stackName, stackType);
  return k8sSecretApi.deleteSecret(secretName, projectKey);
}

export default {
  createNewVSCodeCredentials,
  createNewJupyterCredentials,
  createNewMinioCredentials,
  createNewUserCredentials,
  createStackCredentialSecret,
  deleteStackCredentialSecret,
};
