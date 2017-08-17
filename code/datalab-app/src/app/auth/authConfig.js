const sharedAuthConfig = {
  domain: 'mjbr.eu.auth0.com',
  clientID: 'pz7ZUKi-bL79M6ADP7SWGauOiivdf6Hd',
  audience: 'https://datalab-api.datalabs.nerc.ac.uk/',
  responseType: 'token id_token',
  scope: 'openid',
  redirectUri: `${window.location.origin}/callback`,
  returnTo: `${window.location.origin}/`,
};

export default sharedAuthConfig;
