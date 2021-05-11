import axios from 'axios';
import logger from 'winston';
import secrets from './secrets/secrets';
import { getCorrectAccessUrl } from './login/common';

function requestMinioToken(storage, userToken) {
  return getMinioAccessKeys(storage, userToken)
    .then(minioLogin(storage))
    .catch((error) => {
      logger.error('Error logging in to minio: ', storage.name, error);
      return undefined;
    });
}

function getMinioAccessKeys(storage, userToken) {
  // storage.type is one of NFS, GlusterFS etc. Need to overwrite this with 'minio' to match the backend naming
  return secrets.getStackSecret({ ...storage, type: 'minio' }, storage.projectKey, userToken);
}

const minioLogin = storage => (accessKeys) => {
  if (!accessKeys.access_key || !accessKeys.secret_key) {
    return Promise.reject(new Error('access_key or secret_key not defined'));
  }

  return axios.post(getMinioLoginUrl(storage), createLoginPayload(accessKeys), generateOptions())
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

function generateOptions() {
  return {
    headers: {
      'User-Agent': 'Mozilla',
    },
  };
}

function processLoginResponse(loginResponse) {
  if (loginResponse.data.error) {
    return Promise.reject(new Error(`Minio login failed ${loginResponse.data.error.message}`));
  }

  return loginResponse.data.result.token;
}

export default { requestMinioToken };
