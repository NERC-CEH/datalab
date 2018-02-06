import jwt from 'jsonwebtoken';
import fs from 'fs';
import rsaPemToJwk from 'rsa-pem-to-jwk';
import { get } from 'lodash';
import logger from 'winston';
import config from '../config/config';
import getRoles from '../auth/authzApi';

const PRIVATE_KEY = fs.readFileSync(config.get('privateKey'));
const algorithm = 'RS256';
const audience = 'https://api.datalabs.nerc.ac.uk/';
const expiresIn = '2m';
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
  const userID = get(request, 'user.sub');

  return getRoles(userID)
    .then((roles) => {
      const payload = {
        user: userID,
        roles,
      };
      const options = { algorithm, audience, issuer, keyid, expiresIn };
      const token = jwt.sign(payload, PRIVATE_KEY, options);

      logger.info('Responding with internal token');
      logger.debug(`Roles: ${JSON.stringify(roles)}`);
      return response.send({ token });
    })
    .catch((err) => {
      logger.error('Responding with status code 500');
      response.status(500);
      return response.send({ message: err.message });
    });
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
