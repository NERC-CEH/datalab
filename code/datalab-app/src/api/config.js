import convict from 'convict';

const config = convict({
  apiPort: {
    doc: 'The port for the API service',
    format: 'port',
    default: 8000,
    env: 'PORT',
  },
  corsOrigin: {
    doc: 'The allowed origin for CORS',
    format: String,
    default: 'datalabs.nerc.ac.uk',
    env: 'CORS_ORIGIN',
  },
  connectPort: {
    doc: 'The port for the connect endpoint',
    format: 'port',
    default: 8001,
    env: 'CONNECT_PORT',
  },
});

export default config;
