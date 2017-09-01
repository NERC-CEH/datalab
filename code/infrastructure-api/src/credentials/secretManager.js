import vault from './vault';
import tokenGenerator from './tokenGenerator';

function createNewJupyterCredentials(datalab, id) {
  const jupyterSecret = {
    token: tokenGenerator.generateUUID(),
  };

  return vault.storeSecret(`${datalab}/notebooks/${id}`, jupyterSecret);
}

export default { createNewJupyterCredentials };
