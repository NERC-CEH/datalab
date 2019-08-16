import convict from 'convict';

const config = convict({
  datalabName: {
    doc: 'The name of the datalab',
    format: 'String',
    default: 'testlab',
    env: 'DATALAB_NAME',
  },
  logLevel: {
    doc: 'The logging level',
    format: 'String',
    default: 'info',
    env: 'LOG_LEVEL',
  },
  apiPort: {
    doc: 'The port for the API service',
    format: 'port',
    default: 8000,
    env: 'PORT',
  },
  corsOrigin: {
    doc: 'The allowed origin for CORS',
    format: 'String',
    default: 'datalabs.nerc.ac.uk',
    env: 'CORS_ORIGIN',
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
  vaultApi: {
    doc: 'The endpoint for Vault',
    format: 'url',
    default: 'http://localhost:8200',
    env: 'VAULT_API',
  },
  vaultAppRole: {
    doc: 'The Vault app role for the API',
    format: 'String',
    default: 'undefinedrole',
    env: 'VAULT_APP_ROLE',
  },
  infrastructureApi: {
    doc: 'The endpoint for the infrastructure management service',
    format: 'url',
    default: 'http://localhost:8003',
    env: 'INFRASTRUCTURE_API',
  },
  authorisationService: {
    doc: 'The endpoint for the authorisation service',
    format: 'url',
    default: 'http://localhost:9000',
    env: 'AUTHORISATION_SERVICE',
  },
  authorisationServiceStub: {
    doc: 'If the authorisation service should be stubbed',
    format: 'Boolean',
    default: false,
    env: 'AUTHORISATION_SERVICE_STUB',
  },
  authorisationAudience: {
    doc: 'Expected audience for the authorisation service',
    format: 'url',
    default: 'https://api.datalabs.nerc.ac.uk/',
    env: 'AUTHORISATION_AUDIENCE',
  },
  authorisationIssuer: {
    doc: 'Issuer for the authorisation service to manage',
    format: 'url',
    default: 'https://authorisation.datalabs.nerc.ac.uk/',
    env: 'AUTHORISATION_ISSUER',
  },
});

export default config;