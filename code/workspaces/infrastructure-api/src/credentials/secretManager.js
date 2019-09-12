import vault from './vault';
import tokenGenerator from './tokenGenerator';

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
};
