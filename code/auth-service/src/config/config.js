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
  publicKey: {
    doc: 'The path to the public key for JWT validation',
    format: 'String',
    default: 'public.pem',
    env: 'PUBLIC_KEY',
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
  permissionAttributes: {
    doc: 'The path to yaml file containing permissions',
    format: 'String',
    default: './src/permissions/permissions.yml',
    env: 'AUTHORISATION_PERMISSIONS',
  },
  userManagementClientId: {
    doc: 'Auth0 client id for the user management API',
    format: 'String',
    default: 'userMgmtClientId',
    env: 'USER_MANAGEMENT_API_CLIENT_ID',
  },
  userManagementClientSecret: {
    doc: 'Auth0 client secret for the user management API',
    format: 'String',
    default: 'userMgmtClientSecret',
    env: 'USER_MANAGEMENT_API_CLIENT_SECRET',
  },
});

export default config;
