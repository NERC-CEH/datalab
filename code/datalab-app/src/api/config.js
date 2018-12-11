import convict from 'convict';

const config = convict({
  datalabName: {
    doc: 'The name of the datalab',
    format: 'String',
    default: 'datalab',
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
    default: 'datalabs.ceh.ac.uk',
    env: 'CORS_ORIGIN',
  },
  databaseHost: {
    doc: 'The database hostname',
    format: 'String',
    default: 'localhost',
    env: 'DATABASE_HOST',
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
  databaseUser: {
    doc: 'User to authenticte against the database',
    format: 'String',
    default: 'datalabs',
    env: 'DATABASE_USER',
  },
  databasePassword: {
    doc: 'Password to authenticate against the database',
    format: 'String',
    default: 'datalabs',
    env: 'DATABASE_PASSWORD',
  },
});

export default config;
