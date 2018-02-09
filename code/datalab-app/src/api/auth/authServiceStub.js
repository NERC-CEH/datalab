/**
 * Auth service stub client
 *
 * Provides a stub implementation of the authorisation client that makes no remote calls and instead supplies a
 * verifiable token with admin permissions for the current user.
 */
import jwt from 'jsonwebtoken';

const secret = 'secret';
const audience = 'https://api.datalabs.nerc.ac.uk/';
const issuer = 'https://authorisation.datalabs.nerc.ac.uk/';
const keyid = 'datalabs-authorisation';

function retrievePermissionsToken(authorisationToken) {
  const decodedToken = jwt.decode(authorisationToken.split(' ')[1]);
  const payload = {
    user: decodedToken.sub,
    roles: ['admin', 'datalab:admin'],
  };
  const options = { audience, issuer, keyid };
  const token = jwt.sign(payload, secret, options);
  return Promise.resolve(token);
}

function jwksVerifyConfig() {
  return { secret, audience, issuer };
}

export default { retrievePermissionsToken, jwksVerifyConfig };
