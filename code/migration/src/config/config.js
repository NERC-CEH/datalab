import convict from 'convict';

const config = convict({
  logLevel: {
    doc: 'The logging level',
    format: 'String',
    default: 'info',
    env: 'LOG_LEVEL',
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
    doc: 'Auth0 domain name',
    format: 'String',
    default: 'mjbr',
    env: 'AUTH_ZERO_DOMAIN',
  },
});

export default config;
