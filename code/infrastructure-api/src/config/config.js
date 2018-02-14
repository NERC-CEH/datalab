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
  authServiceUrl: {
    doc: 'The endpoint for the Authorisation service',
    format: 'url',
    default: 'http://datalab-auth-service.test.svc.cluster.local/auth',
    env: 'AUTH_SERVICE_URL',
  },
  authSigninUrl: {
    doc: 'The sign in URL',
    format: 'url',
    default: 'https://testlab.test-datalabs.nerc.ac.uk',
    env: 'AUTH_SIGNIN_URL',
  },
  storageClass: {
    doc: 'The storage class to use for new volumes',
    format: 'String',
    default: 'glusterfs-storage',
    env: 'STORAGE_CLASS',
  },
});

export default config;
