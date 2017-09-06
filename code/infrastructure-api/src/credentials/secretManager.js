import vault from './vault';
import tokenGenerator from './tokenGenerator';

function createNewJupyterCredentials() {
  return {
    token: tokenGenerator.generateUUID(),
  };
}

function storeCredentialsInVault(datalab, id, secret) {
  return vault.storeSecret(`${datalab}/notebooks/${id}`, secret);
}

export default { createNewJupyterCredentials, storeCredentialsInVault };
