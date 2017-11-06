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
    default: 8000,
    env: 'PORT',
  },
});

export default config;
