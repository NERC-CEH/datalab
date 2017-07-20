const sharedAuthConfig = {
  domain: 'mjbr.eu.auth0.com',
  clientID: 'pz7ZUKi-bL79M6ADP7SWGauOiivdf6Hd',
  audience: 'https://datalab-api.datalabs.nerc.ac.uk/',
  responseType: 'token id_token',
  scope: 'openid',
};

let envAuthConfig = {};

if (process.env.NODE_ENV === 'production') {
  envAuthConfig = require('./authConfig.prod'); // eslint-disable-line global-require
} else {
  envAuthConfig = require('./authConfig.dev'); // eslint-disable-line global-require
}

module.exports = { ...sharedAuthConfig, ...envAuthConfig.default };
