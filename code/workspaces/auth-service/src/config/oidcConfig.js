import axios from 'axios';
import logger from 'winston';
import Promise from 'bluebird';
import config from './config';

let cachedOidcConfig;
const oidcDomain = config.get('oidcProviderDomain');

export default async function getOidcConfig({ cacheValue = true, getCachedValue = true } = {}) {
  if (getCachedValue && cachedOidcConfig) {
    return cachedOidcConfig;
  }

  const oidcConfig = await createOidcConfig();

  if (cacheValue) {
    cachedOidcConfig = oidcConfig;
  }

  return oidcConfig;
}

async function createOidcConfig() {
  try {
    return await createOidcConfigFromOpenIdConfigurationEndpoint();
  } catch (error) {
    logger.warn(error.message);
    return createOidcConfigFromEnvironment();
  }
}

async function createOidcConfigFromOpenIdConfigurationEndpoint() {
  logger.info('Creating OIDC configuration from configuration endpoint.');
  const configurationEndpoints = ['http://', 'https://'].map(
    schema => `${schema}${oidcDomain}/.well-known/openid-configuration`,
  );

  try {
    return await Promise.any(configurationEndpoints.map(callConfigurationEndpoint));
  } catch (error) {
    throw new Error('Failed to get OIDC configuration information from provider.');
  }
}

async function callConfigurationEndpoint(endpoint) {
  let response;
  try {
    response = await axios.get(endpoint);
  } catch (error) {
    throw new Error(`Failed to get OIDC configuration information from ${endpoint}.`);
  }
  return response.data;
}

function createOidcConfigFromEnvironment() {
  logger.info('Creating OIDC configuration from environment.');
  const oidcDomainWithSchema = `https://${oidcDomain}`;
  return {
    issuer: `${oidcDomainWithSchema}/`,
    token_endpoint: `${oidcDomainWithSchema}${config.get('oidcOAuthTokenEndpoint')}`,
    jwks_uri: `${oidcDomainWithSchema}${config.get('oidcJwksEndpoint')}`,
  };
}
