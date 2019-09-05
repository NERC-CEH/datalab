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
    default: './resources/private.pem',
    env: 'PRIVATE_KEY',
  },
  publicKey: {
    doc: 'The path to the public key for JWT validation',
    format: 'String',
    default: './resources/public.pem',
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
  authorisationAudience: {
    doc: 'Audience for authorisation',
    format: 'String',
    default: 'https://api.datalabs.nerc.ac.uk/',
    env: 'AUTHORISATION_AUDIENCE',
  },
  authorisationIssuer: {
    doc: 'Issue for Authorisation',
    format: 'String',
    default: 'https://authorisation.datalabs.nerc.ac.uk/',
    env: 'AUTHORISATION_ISSUER',
  },
  permissionAttributes: {
    doc: 'The path to yaml file containing permissions',
    format: 'String',
    default: './resources/permissions.yml',
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
  authZeroAudience: {
    doc: 'Audience for authorisation',
    format: 'String',
    default: 'https://datalab-api.datalabs.nerc.ac.uk/',
    env: 'AUTH_ZERO_AUDIENCE',
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
