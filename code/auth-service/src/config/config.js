import convict from 'convict';

const config = convict({
  logLevel: {
    doc: 'The logging level',
    format: 'String',
    default: 'info',
    env: 'LOG_LEVEL',
  },
  port: {
    doc: 'The port for the Auth service',
    format: 'port',
    default: 9000,
    env: 'PORT',
  },
  privateKey: {
    doc: 'The path to the private key for JWT signing',
    format: 'String',
    default: 'private.pem',
    env: 'PRIVATE_KEY',
  },
  authorisationClientId: {
    doc: 'Auth0 client id for the Datalabs Authorisation API',
    format: 'String',
    default: 'authzClientId',
    env: 'AUTHORISATION_API_CLIENT_ID',
  },
  authorisationClientSecret: {
    doc: 'Auth0 client secret for the Datalabs Authorisation API',
    format: 'String',
    default: 'authzClientSecret',
    env: 'AUTHORISATION_API_CLIENT_SECRET',
  },
  authorisationIdentifier: {
    doc: 'Auth0 identifier for the Datalabs Authorisation API',
    format: 'String',
    default: 'authzIdentifier',
    env: 'AUTHORISATION_API_IDENTIFIER',
  },
});

export default config;
