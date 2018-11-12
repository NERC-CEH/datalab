const sharedAuthConfig = {
  domain: 'mjbr.eu.auth0.com',
  clientID: 'y5ynz3a4GX4uNiOJMXiOgXdfOn1kF6sr',
  audience: 'https://datalab-api.datalabs.ceh.ac.uk/',
  responseType: 'token id_token',
  scope: 'openid profile',
  redirectUri: `${window.location.origin}/callback`,
  returnTo: `${window.location.origin}/`,
};

export default sharedAuthConfig;
