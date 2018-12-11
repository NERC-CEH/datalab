import convict from 'convict';

const config = convict({
  logLevel: {
    doc: 'The logging level',
    format: 'String',
    default: 'info',
    env: 'LOG_LEVEL',
  },
  apiPort: {
    doc: 'The port for the API service',
    format: 'port',
    default: 8003,
    env: 'INFRASTRUCTURE_API_PORT',
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
  kubernetesApi: {
    doc: 'The endpoint for Kubernetes',
    format: 'url',
    default: 'http://localhost:8001',
    env: 'KUBERNETES_API',
  },
  podNamespace: {
    doc: 'The namespace for the pod',
    format: 'String',
    default: 'devtest',
    env: 'KUBERNETES_NAMESPACE',
  },
  storageClass: {
    doc: 'The storage class to use for new volumes',
    format: 'String',
    default: 'glusterfs-storage',
    env: 'STORAGE_CLASS',
  },
  authSigninUrl: {
    doc: 'The sign in URL',
    format: 'url',
    default: 'https://datalab.datalabs.ceh.ac.uk',
    env: 'AUTH_SIGNIN_URL',
  },
  authorisationService: {
    doc: 'The endpoint for the authorisation service',
    format: 'url',
    default: 'http://localhost:9000',
    env: 'AUTHORISATION_SERVICE',
  },
  authorisationServiceStub: {
    doc: 'If the authorisation service is in stubbed mode',
    format: 'Boolean',
    default: false,
    env: 'AUTHORISATION_SERVICE_STUB',
  },
  databaseHost: {
    doc: 'The database hostname',
    format: 'String',
    default: 'localhost',
    env: 'DATABASE_HOST',
  },
  statusCheckInterval: {
    doc: 'Internal (ms) for querying kubernetes pod status',
    format: 'int',
    default: 60000,
    env: 'STATUS_CHECK_INTERVAL',
  },
  maxBodySize: {
    doc: 'Set value for the maximum upload size permitted',
    format: 'String',
    default: '500m',
    env: 'MAX_BODY_SIZE',
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
