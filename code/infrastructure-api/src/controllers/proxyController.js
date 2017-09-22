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
    .catch(handleError(response, 'creating', name));
}

function deleteRoute(request, response) {
  // Parse request for errors
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    logger.error(`Invalid route creation request: ${request.body}`);
    return response.status(400).json({ errors: errors.mapped() });
  }

  // Build request params
  const { name, datalab } = matchedData(request);
  return proxyRouteApi.deleteRoute(name, datalab)
    .then(() => {
      response.status(204);
      response.send({ message: 'OK' });
    })
    .catch(handleError(response, 'deleting', name));
}

const handleError = (response, action, name) => (error) => {
  logger.error(error);
  response.status(500);
  response.send({
    message: `Error ${action} route: ${name}`,
    error: error.message });
};

const createProxyRouteValidator = [
  check('name').exists().withMessage('name must be specified'),
  check('datalab.name').exists().withMessage('datalab.name must be specified'),
  check('datalab.domain').exists().withMessage('datalab.domain must be specified'),
  check('port').exists().withMessage('port must be specified'),
];

const deleteProxyRouteValidator = [
  check('name').exists().withMessage('name must be specified'),
  check('datalab.name').exists().withMessage('datalab.name must be specified'),
  check('datalab.domain').exists().withMessage('datalab.domain must be specified'),
];

export default { createRoute, deleteRoute, createProxyRouteValidator, deleteProxyRouteValidator };
