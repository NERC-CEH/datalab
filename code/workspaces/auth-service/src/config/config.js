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
  oidcProviderDomain: {
    doc: 'URL of the OpenID Connect provider domain',
    format: 'String',
    default: 'login.datalabs.ceh.ac.uk',
    env: 'OIDC_PROVIDER_DOMAIN',
  },
  oidcProviderAudience: {
    doc: 'Audience for authorisation',
    format: 'String',
    default: 'https://datalab.datalabs.nerc.ac.uk/api',
    env: 'OIDC_PROVIDER_AUDIENCE',
  },
  oidcOAuthTokenEndpoint: {
    doc: `Fallback for when OIDC provider does not provide configuration information via /.well-known/openid-configuration.
          The endpoint on the oidcProviderDomain at which OAuth tokens are issued.`,
    format: 'String',
    default: '/oauth/token',
    env: 'OIDC_OAUTH_TOKEN_ENDPOINT',
  },
  oidcJwksEndpoint: {
    doc: `Fallback for when OIDC provider does not provide configuration information via /.well-known/openid-configuration.
          The endpoint on the oidcProviderDomain at which JSON Web Key Set (JWKS) information is obtained.`,
    format: 'String',
    default: '/.well-known/jwks.json',
    env: 'OIDC_JWKS_ENDPOINT',
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
