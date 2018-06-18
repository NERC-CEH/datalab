import axios from 'axios';
import { get } from 'lodash';
import config from '../config/config';
import { getOrSetCacheAsyncWrapper } from '../cache/cache';
import logger from '../logger';

const authOAuthEndpoint = `https://${config.get('authZeroDomain')}.eu.auth0.com/oauth/token`;

const requestAccessToken = accessTokenRequest =>
  axios.post(authOAuthEndpoint, {
    ...accessTokenRequest,
    grant_type: 'client_credentials',
  })
    .then(response => get(response, 'data.access_token'))
    .then((response) => {
      logger.debug(`Retrived access token for: ${accessTokenRequest.audience}`);
      return response;
    })
    .catch((err) => { throw err; });

const getAccessToken = accessTokenRequest =>
  getOrSetCacheAsyncWrapper(accessTokenRequest.audience, () =>
    requestAccessToken(accessTokenRequest));

export default getAccessToken;
