import { check } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';
import controllerHelper from './controllerHelper';
import proxyRouteApi from '../kong/proxyRouteApi';

const TYPE = 'route';

function createRoute(request, response) {
  const errorMessage = 'Invalid route creation request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, createRouteExec);
}

function deleteRoute(request, response) {
  const errorMessage = 'Invalid route deletion request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, deleteRouteExec);
}

function createRouteExec(request, response) {
  // Build request params
  const { name, datalab, port } = matchedData(request);

  return proxyRouteApi.createOrUpdateRoute(name, datalab, port)
    .then(controllerHelper.sendSuccessfulCreation(response))
    .catch(controllerHelper.handleError(response, 'creating', TYPE, name));
}

function deleteRouteExec(request, response) {
  // Build request params
  const { name, datalab } = matchedData(request);
  return proxyRouteApi.deleteRoute(name, datalab)
    .then(controllerHelper.sendSuccessfulDeletion(response))
    .catch(controllerHelper.handleError(response, 'deleting', TYPE, name));
}

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
