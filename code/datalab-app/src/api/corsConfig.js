import config from './config';

function configureCorsHeaders(app) {
  app.all('/*', (request, response, next) => {
    response.header('Access-Control-Allow-Origin', getCorsOrigin(request));
    response.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Api-Authorization');
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
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
