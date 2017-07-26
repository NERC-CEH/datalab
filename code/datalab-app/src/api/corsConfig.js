/**
 * This code inspects a config parameter to determine which origins are allowed. A '*'
 * means any domain is allowed and we should return a wildcard CORS header. For all other
 * values we should inspect the origin of the request and if it contains the domain
 * specified then the origin of the request should be returned.
 *
 * @param app the app object to add the cors routes to
 */

import config from './config';

function configureCorsHeaders(app) {
  app.all('/*', (request, response, next) => {
    response.header('Access-Control-Allow-Origin', getCorsOrigin(request));
    response.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
  });

  app.options('/*', (request, response) => {
    // Options required to process the preflight requests.
    // Respond with (403) forbidden if origins don't match.
    const status = getCorsOrigin(request) ? 204 : 403;
    response.sendStatus(status);
  });
}

function getCorsOrigin(request) {
  const configuredOrigin = process.env.NODE_ENV === 'production' ? config.get('corsOrigin') : '*';
  if (configuredOrigin === '*') {
    // All origins are allowed return a wildcard
    return configuredOrigin;
  }
  const requestOrigin = request.headers.origin;
  if (requestOrigin && requestOrigin.indexOf(configuredOrigin) > -1) {
    return requestOrigin;
  }
  return null;
}

export default configureCorsHeaders;
