import axios from 'axios';
import logger from 'winston';
import config from '../../config';

const vaultBaseUrl = config.get('vaultApi');

function requestPath(path) {
  return requestVaultToken()
    .then(requestSecret(path))
    .then(response => response.data.data)
    .catch((error) => {
      logger.error('Error retrieving secret %s: ', path, error.response.data);
      return { message: 'Unable to retrieve secret' };
    });
}

function requestVaultToken() {
  const data = {
    role_id: config.get('vaultAppRole'),
  };

  return axios.post(getAppRoleLoginUrl(), data);
}

const requestSecret = path => (response) => {
  const params = {
    headers: { 'X-Vault-Token': response.data.auth.client_token },
  };

  return axios.get(getSecretUrl(path), params);
};

function getAppRoleLoginUrl() {
  return `${vaultBaseUrl}/v1/auth/approle/login`;
}

function getSecretUrl(path) {
  return `${vaultBaseUrl}/v1/secret/${path}`;
}

export default { requestPath };
