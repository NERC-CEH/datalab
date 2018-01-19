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

function storeCredentialsInVault(datalab, id, secret) {
  return vault.ensureSecret(`${datalab}/stacks/${id}`, secret);
}

function deleteSecret(datalab, id) {
  return vault.deleteSecret(`${datalab}/stacks/${id}`);
}

function storeMinioCredentialsInVault(datalab, id, strategy) {
  return vault.ensureSecret(`${datalab}/storage/${id}`, strategy);
}

function deleteMinioCredentials(datalab, id) {
  return vault.deleteSecret(`${datalab}/storage/${id}`);
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
