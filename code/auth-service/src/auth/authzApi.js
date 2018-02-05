import axios from 'axios';
import { get } from 'lodash';
import logger from 'winston/lib/winston';
import config from '../config/config';

const authOuthEndpoint = 'https://mjbr.eu.auth0.com/oauth/token';
const authorisationExtensionEndpoint = 'https://mjbr.eu.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/api';

const accessTokenRequest = {
  audience: config.get('authorisationIdentifier'),
  client_id: config.get('authorisationClientId'),
  client_secret: config.get('authorisationClientSecret'),
  grant_type: 'client_credentials',
};

function getAuthzAccessToken() {
  logger.info('Requesting Authz Service access token');
  return axios.post(authOuthEndpoint, accessTokenRequest)
    .then(response => get(response, 'data.access_token'))
    .catch(() => {
      throw new Error('Unable to retrieve access token for the Authz Service.');
    });
}

function getUserRoles(userId) {
  logger.info('Requesting roles from Authz Service');
  logger.debug(`UserId: ${userId}`);
  const url = `${authorisationExtensionEndpoint}/users/${userId}/roles`;

  return getAuthzAccessToken()
    .then(bearer =>
      axios.get(url, { headers: { Authorization: `Bearer ${bearer}` } })
        .then(extractRoleNames)
        .catch(() => {
          throw new Error('Unable to retrieve roles from the Authz Service.');
        }))
    .catch((err) => {
      logger.warn(err.message);
      throw err;
    });
}

const extractRoleNames = response =>
  get(response, 'data', []).map(role => role.name);

export default getUserRoles;
