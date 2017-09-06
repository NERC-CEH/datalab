import logger from 'winston';
import { check, validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';
import proxyRouteApi from '../kong/proxyRouteApi';

function createRoute(request, response) {
  // Parse request for errors
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    logger.error(`Invalid route creation request: ${request.body}`);
    return response.status(400).json({ errors: errors.mapped() });
  }

  // Build request params
  const { name, datalab, port } = matchedData(request);

  return proxyRouteApi.createOrUpdateRoute(name, datalab, port)
    .then(() => {
      response.status(201);
      response.send({ message: 'OK' });
    })
    .catch(handleError(response, name));
}

const handleError = (response, name) => (error) => {
  logger.error(error);
  response.status(500);
  response.send({
    message: `Error creating route: ${name}`,
    error: error.message });
};

const createProxyRouteValidator = [
  check('name').exists().withMessage('name must be specified'),
  check('datalab.name').exists().withMessage('datalab.name must be specified'),
  check('datalab.domain').exists().withMessage('datalab.domain must be specified'),
  check('port').exists().withMessage('port must be specified'),
];

export default { createRoute, createProxyRouteValidator };
