import { check, matchedData } from 'express-validator';
import controllerHelper from './controllerHelper';
import volumeManager from '../stacks/volumeManager';
import dataStorageRepository from '../dataaccess/dataStorageRepository';

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

function listActiveVolumes(request, response) {
  return dataStorageRepository.getAllActive(request.user)
    .then(volumes => response.send(volumes))
    .catch(controllerHelper.handleError(response, 'retrieving', TYPE, undefined));
}

function getById(request, response) {
  const { id } = matchedData(request);

  return dataStorageRepository.getById(request.user, id)
    .then(volume => response.send(volume))
    .catch(controllerHelper.handleError(response, 'retrieving', TYPE, undefined));
}

function addUsers(request, response) {
  const { name, userIds } = matchedData(request);

  return dataStorageRepository.addUsers(name, userIds)
    .then(volume => response.send(volume))
    .catch(controllerHelper.handleError(response, 'adding user', TYPE, name));
}

function removeUsers(request, response) {
  const { name, userIds } = matchedData(request);

  return dataStorageRepository.removeUsers(name, userIds)
    .then(volume => response.send(volume))
    .catch(controllerHelper.handleError(response, 'removing user', TYPE, name));
}

function createVolumeExec(request, response) {
  // Build request params
  const params = matchedData(request);

  // Handle request
  const { user } = request;
  return volumeManager.createVolume(user, params)
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

const getByIdValidator = [
  check('id').exists().withMessage('id must be specified').trim(),
];

const updateVolumeUserValidator = [
  check('name').exists().withMessage('id must be specified').trim(),
  check('userIds.*').exists().withMessage('userIds must be specified').trim(),
];

const coreVolumeValidator = [
  check('projectKey').exists().withMessage('projectKey must be specified').trim(),
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
  check('displayName').exists().withMessage('displayName must be specified').trim(),
  check('description').exists().withMessage('description must be specified').trim(),
  check('type')
    .exists()
    .isInt({ min: 1, max: 1 })
    .withMessage('type must be specified as a valid storage type')
    .trim(),
  check('volumeSize')
    .exists()
    .withMessage('Volume Size must be specified')
    .isInt({ min: 5, max: 200 })
    .withMessage('Volume Size must be an integer between 5 and 200')
    .trim(),
];

export default {
  getByIdValidator,
  coreVolumeValidator,
  createVolumeValidator,
  updateVolumeUserValidator,
  createVolume,
  deleteVolume,
  queryVolume,
  listVolumes,
  getById,
  listActiveVolumes,
  addUsers,
  removeUsers,
};
