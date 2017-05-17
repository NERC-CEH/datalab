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
    default: 'datalab.nerc.ac.uk',
    env: 'CORS_ORIGIN',
  },
});

export default config;
