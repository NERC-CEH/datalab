import { service } from 'common';
import { check, matchedData } from 'express-validator';
import volumeManager from '../stacks/volumeManager';
import dataStorageRepository from '../dataaccess/dataStorageRepository';

async function createVolume(request, response, next) {
  // Build request params
  const params = matchedData(request);

  // Handle request
  const { user } = request;

  try {
    await volumeManager.createVolume(user, params);
    response.status(201);
    response.send({ message: 'OK' });
  } catch (error) {
    next(new Error(`Error creating volume: ${params.name}: ${error.message}`));
  }
}

async function deleteVolume(request, response, next) {
  // Build request params
  const params = matchedData(request);

  // Handle request
  try {
    await volumeManager.deleteVolume(params);
    response.status(204);
    response.send({ message: 'OK' });
  } catch (error) {
    next(new Error(`Error deleting volume: ${params.name}: ${error.message}`));
  }
}

async function queryVolume(request, response) {
  // Build request params
  const params = matchedData(request);

  // Handle request
  const volume = await volumeManager.queryVolume(params);
  response.send(volume);
}

async function listVolumes(request, response) {
  const volumes = await volumeManager.listVolumes();
  response.send(volumes);
}

async function listActiveVolumes(request, response) {
  const volumes = await dataStorageRepository.getAllActive(request.user);
  response.send(volumes);
}

async function getById(request, response) {
  const { id } = matchedData(request);

  const volume = await dataStorageRepository.getById(request.user, id);
  if (volume) {
    response.send(volume);
  } else {
    response.status(404).send();
  }
}

async function addUsers(request, response, next) {
  const { name, userIds } = matchedData(request);

  try {
    const volume = await dataStorageRepository.addUsers(name, userIds);
    response.send(volume);
  } catch (error) {
    next(new Error(`Unable to add users to volume ${name}: ${error.message}`));
  }
}

async function removeUsers(request, response, next) {
  const { name, userIds } = matchedData(request);

  try {
    const volume = await dataStorageRepository.removeUsers(name, userIds);
    response.send(volume);
  } catch (error) {
    next(new Error(`Unable to remove users from volume ${name}: ${error.message}`));
  }
}

const getByIdValidator = service.middleware.validator([
  check('id').exists().isMongoId().withMessage('id must be specified as a Mongo Id'),
]);

const updateVolumeUserValidator = service.middleware.validator([
  check('name').exists().withMessage('volume name must be specified').trim(),
  check('userIds').exists().withMessage('userIds must be specified'),
  check('userIds.*').exists().withMessage('userIds must be specified').trim(),
]);

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

const createVolumeValidator = service.middleware.validator([
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
]);

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
