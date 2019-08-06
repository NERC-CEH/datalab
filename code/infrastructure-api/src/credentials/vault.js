import axios from 'axios';
import logger from '../config/logger';
import { has, get } from 'lodash';
import config from '../config/config';

const vaultBaseUrl = config.get('vaultApi');
const vaultAppRole = config.get('vaultAppRole');

function ensureSecret(path, strategy) {
  logger.info('Storing secrets in vault path: %s', path);
  return requestVaultToken()
    .then(processCreateRequest(path, strategy))
    .catch(handleError(path));
}

function deleteSecret(path) {
  logger.info('Deleting secret at vault path: %s', path);
  return requestVaultToken()
    .then(processDeleteRequest(path))
    .catch(handleDeleteError(path));
}

const processCreateRequest = (path, strategy) => (token) => {
  const authHeader = createAuthenticationHeader(token);
  const secretUrl = getSecretUrl(path);
  return retrieveSecret(secretUrl, authHeader)
    .then(createSecretIfRequired(secretUrl, strategy, authHeader));
};

function retrieveSecret(secretUrl, authHeader) {
  return axios.get(secretUrl, authHeader)
    .then(response => response.data)
    .catch(() => undefined);
}

const createSecretIfRequired = (secretUrl, strategy, authHeader) => (secret) => {
  if (!secret) {
    logger.debug(`Secret does not exist, creating using strategy ${strategy.name}`);
    const newSecret = strategy();
    return storeVaultSecret(secretUrl, newSecret, authHeader);
  }
  logger.debug('Secret already exists, returning for later use');
  return Promise.resolve(secret.data);
};

function storeVaultSecret(secretUrl, value, authHeader) {
  logger.debug(`Storing Vault secret at: ${secretUrl}`);
  return axios.post(secretUrl, value, authHeader)
    .then(() => value);
}

const processDeleteRequest = path => (token) => {
  const authHeader = createAuthenticationHeader(token);
  const secretUrl = getSecretUrl(path);
  return axios.delete(secretUrl, authHeader)
    .then(response => response.data);
};

function requestVaultToken() {
  if (!vaultAppRole) {
    logger.error('VAULT_APP_ROLE has not been set. Vault authentication will fail!');
  }

  const data = {
    role_id: vaultAppRole,
  };

  return axios.post(getAppRoleLoginUrl(), data)
    .then(response => response.data.auth.client_token);
}

function createAuthenticationHeader(token) {
  return { headers: { 'X-Vault-Token': token } };
}

function getAppRoleLoginUrl() {
  logger.debug(`Vault login url: ${vaultBaseUrl}/v1/auth/approle/login`);
  return `${vaultBaseUrl}/v1/auth/approle/login`;
}

function getSecretUrl(path) {
  logger.debug(`Vault secret url: ${vaultBaseUrl}/v1/secret/${path}`);
  return `${vaultBaseUrl}/v1/secret/${path}`;
}

const handleError = path => (error) => {
  if (has(error, 'response.data')) {
    logger.error('Error retrieving secret %s: ', path, error.response.data);
  } else {
    logger.error('Error retrieving secret %s: ', path, error);
  }
  return { message: 'Unable to retrieve secret' };
};

const handleDeleteError = path => (error) => {
  if (has(error, 'response.status') && get(error, 'response.status') === 404) {
    logger.warn('Could not find vault secret: %s to delete it', path);
    return Promise.resolve();
  }
  logger.error('Error deleting vault secret: %s', path, error.response.data);
  return { message: 'Unable to delete secret' };
};

export default { ensureSecret, deleteSecret };
