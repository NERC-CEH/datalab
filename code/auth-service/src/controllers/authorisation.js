import jwt from 'jsonwebtoken';
import fs from 'fs';
import rsaPemToJwk from 'rsa-pem-to-jwk';
import config from '../config/config';

const PRIVATE_KEY = fs.readFileSync(config.get('privateKey'));
const algorithm = 'RS256';
const audience = 'https://api.datalabs.nerc.ac.uk/';
const issuer = 'https://authorisation.datalabs.nerc.ac.uk/';
const keyid = 'datalabs-authorisation';

function checkUser(request, response) {
  if (!request.user) {
    response.status(401);
    return response.send({ message: `User not Authorised for domain ${request.headers.host}` });
  }

  return response.send({ message: `User Authorised for domain ${request.headers.host}` });
}

function generatePermissionToken(request, response) {
  const payload = {
    user: request.user.sub,
    roles: ['admin', 'datalab:user', 'testlab:admin'],
  };
  const options = { algorithm, audience, issuer, keyid };
  const token = jwt.sign(payload, PRIVATE_KEY, options);

  return response.send({ token });
}

/**
 * Construct the JWKS array to allow clients to retrieve the JWT public signing key
 * https://tools.ietf.org/id/draft-ietf-jose-json-web-key-41.txt
 * https://www.npmjs.com/package/rsa-pem-to-jwk
 * @param request
 * @param response
 */
function serveJWKS(request, response) {
  const jwk = rsaPemToJwk(PRIVATE_KEY, { use: 'sig' }, 'public');
  jwk.kid = keyid;
  return response.send({ keys: [jwk] });
}

export default { checkUser, generatePermissionToken, serveJWKS };
