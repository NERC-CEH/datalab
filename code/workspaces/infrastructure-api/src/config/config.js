import convict from 'convict';
import convictFormatWithValidator from 'convict-format-with-validator';

convict.addFormats(convictFormatWithValidator);

const config = convict({
  logLevel: {
    doc: 'The logging level',
    format: 'String',
    default: 'info',
    env: 'LOG_LEVEL',
  },
  datalabName: {
    doc: 'The name of the datalab',
    format: 'String',
    default: 'testlab',
    env: 'DATALAB_NAME',
  },
  datalabDomain: {
    doc: 'The domain the datalabs instance is running on',
    format: 'String',
    default: 'datalabs.localhost',
    env: 'DATALAB_DOMAIN',
  },
  apiPort: {
    doc: 'The port for the API service',
    format: 'port',
    default: 8003,
    env: 'INFRASTRUCTURE_API_PORT',
  },
  kubernetesApi: {
    doc: 'The endpoint for Kubernetes',
    format: 'url',
    default: 'http://localhost:8001',
    env: 'KUBERNETES_API',
  },
  authSigninUrl: {
    doc: 'The sign in URL',
    format: 'url',
    default: 'https://testlab.test-datalabs.nerc.ac.uk',
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
  authorisationServiceForIngress: {
    doc: `The endpoint for the authorisation service within the ingress.
      Used when developing locally and auth service is running outside of cluster.
      Should default to same value as authorisationService when not set hence empty default value for easy handling in code.`,
    format: 'url',
    default: '',
    env: 'AUTHORISATION_SERVICE_FOR_INGRESS',
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
  statusCheckInterval: {
    doc: 'Internal (ms) for querying kubernetes pod status',
    format: 'int',
    default: 60000,
    env: 'STATUS_CHECK_INTERVAL',
  },
  maxBodySize: {
    doc: 'Set value for the maximum upload size permitted',
    format: 'String',
    default: '50g',
    env: 'MAX_BODY_SIZE',
  },
  clusterIssuer: {
    doc: 'The cluster issuer to use on ingress, if any',
    format: 'String',
    default: '',
    env: 'CLUSTER_ISSUER',
  },
  emailPassword: {
    doc: 'The password for the email account linked to the email notifier',
    format: 'String',
    default: '',
    env: 'EMAIL_NOTIFIER_PASSWORD',
  },
});

export default config;
