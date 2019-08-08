import { check, matchedData } from 'express-validator';
import controllerHelper from './controllerHelper';
import volumeManager from '../stacks/volumeManager';

const TYPE = 'volume';

function createVolume(request, response) {
  const errorMessage = 'Invalid volume creation request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, createVolumeExec);
}

function deleteVolume(request, response) {
  const errorMessage = 'Invalid volume deletion request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, deleteVolumeExec);
}

function queryVolume(request, response) {
  // Build request params
  const params = matchedData(request);

  // Handle request
  return volumeManager.queryVolume(params)
    .then(volume => response.send(volume))
    .catch(controllerHelper.handleError(response, 'retrieving', TYPE, params.name));
}

function listVolumes(request, response) {
  return volumeManager.listVolumes()
    .then(volumes => response.send(volumes))
    .catch(controllerHelper.handleError(response, 'retrieving', TYPE, undefined));
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
  check('datalabInfo.name').exists().withMessage('datalabInfo.name must be specified').trim(),
  check('datalabInfo.domain').exists().withMessage('datalabInfo.domain must be specified').trim(),
  check('name')
    .exists()
    .withMessage('Name must be specified')
    .isAscii()
    .withMessage('Name must only use the characters a-z')
    .isLength({ min: 4, max: 12 })
    .withMessage('Name must be 4-12 characters long')
    .trim(),
];

const createVolumeValidator = [
  ...coreVolumeValidator,
  check('volumeSize')
    .exists()
    .withMessage('Volume Size must be specified')
    .isInt({ min: 5, max: 200 })
    .withMessage('Volume Size must be an integer between 5 and 200')
    .trim(),
];

export default { coreVolumeValidator, createVolumeValidator, createVolume, deleteVolume, queryVolume, listVolumes };
