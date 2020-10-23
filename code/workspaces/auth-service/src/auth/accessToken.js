import axios from 'axios';
import logger from 'winston';
import { get } from 'lodash';
import getOidcConfig from '../config/oidcConfig';

async function requestAccessToken(accessTokenRequest) {
  logger.info('Requesting access token.');

  const oidcConfig = await getOidcConfig();

  try {
    const response = await axios.post(
      oidcConfig.token_endpoint, { ...accessTokenRequest, grant_type: 'client_credentials' },
    );
    return get(response, 'data.access_token');
  } catch (error) {
    throw new Error(`Unable to retrieve access token - Original message: "${error.message}"`);
  }
}

export default requestAccessToken;
