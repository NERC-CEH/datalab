import axios from 'axios';
import { get } from 'lodash';
import logger from 'winston';
import config from '../config/config';
import requestAccessToken from './accessToken';
import { getOrSetCacheAsyncWrapper } from '../cache/cache';

export const authorisationExtensionEndpoint = 'https://mjbr.eu.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/api';

const accessTokenRequest = {
  audience: config.get('authorisationIdentifier'),
  client_id: config.get('authorisationClientId'),
  client_secret: config.get('authorisationClientSecret'),
};

export function getUserRoles(userId) {
  logger.info('Requesting roles from Authz Service');
  logger.debug(`UserId: ${userId}`);
  const url = `${authorisationExtensionEndpoint}/users/${userId}/roles`;

  return requestAccessToken(accessTokenRequest)
    .then(bearer =>
      axios.get(url, { headers: { Authorization: `Bearer ${bearer}` } })
        .then(extractRoleNames)
        .catch(() => {
          throw new Error('Unable to retrieve roles from the Authz Service.');
        }))
    .catch((err) => {
      logger.error(err.message);
      throw err;
    });
}

const extractRoleNames = response =>
  get(response, 'data', []).map(role => role.name);

const cacheOrGetUserRoles = userId =>
  getOrSetCacheAsyncWrapper(`AUTH_ROLES_${userId}`, getUserRoles)(userId);

export default cacheOrGetUserRoles;
