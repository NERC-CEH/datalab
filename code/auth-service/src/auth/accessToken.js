import axios from 'axios';
import logger from 'winston';
import { get } from 'lodash';
import config from '../config/config';

export const authOAuthEndpoint = `https://${config.get('authZeroDomain')}/oauth/token`;

function requestAccessToken(accessTokenRequest) {
  logger.info('Requesting access token.');
  return axios.post(authOAuthEndpoint, { ...accessTokenRequest, grant_type: 'client_credentials' })
    .then(response => get(response, 'data.access_token'))
    .catch(() => {
      throw new Error('Unable to retrieve access token.');
    });
}

export default requestAccessToken;
