import { check } from 'express-validator/check';
import { matchedData, sanitize } from 'express-validator/filter';
import controllerHelper from './controllerHelper';
import volumeManager from '../stacks/volumeManager';

const TYPE = 'volume';

function createVolume(request, response) {
  const errorMessage = 'Invalid stack creation request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, createVolumeExec);
}

function deleteVolume(request, response) {
  const errorMessage = 'Invalid stack deletion request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, deleteVolumeExec);
}

function createVolumeExec(request, response) {
  // Build request params
  const params = matchedData(request);

  // Handle request
  return volumeManager.createVolume(params)
    .then(controllerHelper.sendSuccessfulCreation(response))
    .catch(controllerHelper.handleError(response, 'creating', TYPE, params.name));
}

function deleteVolumeExec(request, response) {
  // Build request params
  const params = matchedData(request);

  // Handle request
  return volumeManager.deleteVolume(params)
    .then(controllerHelper.sendSuccessfulDeletion(response))
    .catch(controllerHelper.handleError(response, 'deleting', TYPE, params.name));
}

const coreVolumeValidator = [
  sanitize('*').trim(),
  check('datalabInfo.name').exists().withMessage('datalabInfo.name must be specified'),
  check('datalabInfo.domain').exists().withMessage('datalabInfo.domain must be specified'),
  check('name')
    .exists()
    .withMessage('Name must be specified')
    .isAscii()
    .withMessage('Name must only use the characters a-z')
    .isLength({ min: 4, max: 12 })
    .withMessage('Name must be 4-12 characters long'),
];

const createVolumeValidator = [
  ...coreVolumeValidator,
  check('volumeSize')
    .exists()
    .withMessage('Volume Size must be specified')
    .isInt({ min: 1, max: 200 })
    .withMessage('Volume Size must be an integer between 1 and 200'),
];

export default { coreVolumeValidator, createVolumeValidator, createVolume, deleteVolume };
