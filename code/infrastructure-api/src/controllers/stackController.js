import { check } from 'express-validator/check';
import { matchedData, sanitize } from 'express-validator/filter';
import { isBoolean, indexOf } from 'lodash';
import controllerHelper from './controllerHelper';
import stackManager from '../stacks/stackManager';
import { STACKS } from '../stacks/stacks';

const TYPE = 'stack';

function createStack(request, response) {
  const errorMessage = 'Invalid stack creation request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, createStackExec);
}

function deleteStack(request, response) {
  const errorMessage = 'Invalid stack deletion request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, deleteStackExec);
}

function listStacks(request, response) {
  return stackManager.listVolumes(request.user)
    .then(volumes => response.send(volumes))
    .catch(controllerHelper.handleError(response, 'retrieving', TYPE, undefined));
}

function createStackExec(request, response) {
  // Build request params
  const params = matchedData(request);

  // Handle request
  return stackManager.createStack(params)
    .then(controllerHelper.sendSuccessfulCreation(response))
    .catch(controllerHelper.handleError(response, 'creating', TYPE, params.name));
}

function deleteStackExec(request, response) {
  // Build request params
  const params = matchedData(request);

  // Handle request
  return stackManager.deleteStack(params)
    .then(controllerHelper.sendSuccessfulDeletion(response))
    .catch(controllerHelper.handleError(response, 'deleting', TYPE, params.name));
}

const coreStackValidator = [
  sanitize('*').trim(),
  check('datalabInfo.name').exists().withMessage('datalabInfo.name must be specified'),
  check('datalabInfo.domain').exists().withMessage('datalabInfo.domain must be specified'),
  check('datalabInfo.volume').exists().withMessage('datalabInfo.volume must be specified'),
  check('name')
    .exists()
    .withMessage('Name must be specified')
    .isAscii()
    .withMessage('Name must only use the characters a-z')
    .isLength({ min: 4, max: 12 })
    .withMessage('Name must be 4-12 characters long'),
  check('type').exists().withMessage('Type must be specified'),
];

const createStackValidator = [
  ...coreStackValidator,
  check('sourcePath', 'sourcePath must be specified for publication request')
    .custom((value, { req }) => {
      if (indexOf([STACKS.RSHINY.name, STACKS.NBVIEWER.name], req.body.type) > -1) {
        return value;
      }
      return true;
    }),
  check('isPublic', 'isPublic boolean must be specified for publication request')
    .custom((value, { req }) => {
      if (indexOf([STACKS.RSHINY.name, STACKS.NBVIEWER.name], req.body.type) > -1) {
        return isBoolean(value);
      }
      return true;
    }),
  check('volumeMount').exists().withMessage('A Volume Mount must be specified'),
];

export default { coreStackValidator, createStackValidator, createStack, deleteStack, listStacks };
