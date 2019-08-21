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
  authZeroDomain: {
    doc: 'URL of the auth0 domain',
    format: 'String',
    default: 'mjbr.eu.auth0.com',
    env: 'AUTH_ZERO_DOMAIN',
  },
  databaseHost: {
    doc: 'The database hostname',
    format: 'String',
    default: 'localhost',
    env: 'DATABASE_HOST',
  },
  databaseUser: {
    doc: 'The user to authenticate against the database',
    format: 'String',
    default: 'datalabs-root-u',
    env: 'DATABASE_USER',
  },
  databasePassword: {
    doc: 'The password for the user being authenticated against the database',
    format: 'String',
    default: 'datalabs-root-p',
    env: 'DATABASE_PASSWORD',
  },
});

export default config;
