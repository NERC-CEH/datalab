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
  kubernetesMasterUrl: {
    doc: 'The endpoint for Kubernetes Master',
    format: 'url',
    default: 'http://192.168.3.6',
    env: 'KUBERNETES_MASTER_URL',
  },
  kubernetesApi: {
    doc: 'The endpoint for Kubernetes',
    format: 'url',
    default: 'http://localhost:8001',
    env: 'KUBERNETES_API',
  },
  kongApi: {
    doc: 'The endpoint for Kong',
    format: 'url',
    default: 'http://localhost:8002',
    env: 'KONG_API',
  },
  podNamespace: {
    doc: 'The namespace for the pod',
    format: 'String',
    default: 'devtest',
    env: 'KUBERNETES_NAMESPACE',
  },
});

export default config;
