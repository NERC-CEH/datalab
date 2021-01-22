import axios from 'axios';
import logger from 'winston';
import vault from './vault/vault';
import { getCorrectAccessUrl } from './login/common';

function requestMinioToken(storage) {
  return vault.requestStorageKeys(storage.projectKey, storage)
    .then(minioLogin(storage))
    .catch((error) => {
      logger.error('Error logging in to minio: ', storage.name, error);
      return undefined;
    });
}

const minioLogin = storage => (accessKeys) => {
  if (!accessKeys.access_key || !accessKeys.secret_key) {
    return Promise.reject(new Error('access_key or secret_key not defined'));
  }

  return axios.post(getMinioLoginUrl(storage), createLoginPayload(accessKeys))
    .then(processLoginResponse);
};

function getMinioLoginUrl(storage) {
  const minioRootUrl = getCorrectAccessUrl(storage);
  const minioApiUrl = `${minioRootUrl}/webrpc`;
  logger.debug(`Request log in token from Minio at: ${minioApiUrl}`);
  return minioApiUrl;
}

function createLoginPayload(accessKeys) {
  return {
    id: 1,
    jsonrpc: '2.0',
    params: {
      username: accessKeys.access_key,
      password: accessKeys.secret_key,
    },
    method: 'Web.Login',
  };
}

function processLoginResponse(loginResponse) {
  if (loginResponse.data.error) {
    return Promise.reject(new Error(`Minio login failed ${loginResponse.data.error.message}`));
  }

  return loginResponse.data.result.token;
}

export default { requestMinioToken };
