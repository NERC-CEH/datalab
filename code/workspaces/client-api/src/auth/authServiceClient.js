/**
 * Auth service client
 *
 * Provides a client implementation to communicate with a remote auth service.
 */
import axios from 'axios';
import jwksRsa from 'jwks-rsa';
import config from '../config';

const AUTHORISATION_URL = `${config.get('authorisationService')}/authorise`;
const JWKS_URL = `${config.get('authorisationService')}/jwks`;

function retrievePermissionsToken(authorisationToken) {
  const options = {
    headers: {
      authorization: authorisationToken,
    },
  };

  return axios.get(AUTHORISATION_URL, options)
    .then(data => data.data.token);
}

function jwksVerifyConfig() {
  return {
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 10,
      jwksUri: JWKS_URL,
    }),
    audience: config.get('authorisationAudience'),
    issuer: config.get('authorisationIssuer'),
    algorithms: ['RS256'],
  };
}

export default { retrievePermissionsToken, jwksVerifyConfig };
