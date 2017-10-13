import vault from './vault';
import tokenGenerator from './tokenGenerator';

function createNewJupyterCredentials() {
  return {
    token: tokenGenerator.generateUUID(),
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

export default { createNewJupyterCredentials, createNewUserCredentials, storeCredentialsInVault, deleteSecret };
