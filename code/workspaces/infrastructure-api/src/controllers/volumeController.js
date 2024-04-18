import { service } from 'service-chassis';
import { check, body, matchedData } from 'express-validator';
import { storageCreationAllowedTypes } from 'common/src/config/storage';
import volumeManager from '../stacks/volumeManager';
import dataStorageRepository from '../dataaccess/dataStorageRepository';
import logger from '../config/logger';
import { DELETED } from '../models/dataStorage.model';

const USER_UPDATEABLE_FIELDS = ['displayName', 'description', 'users'];

async function createVolume(request, response, next) {
  // Build request params
  const params = matchedData(request);

  // Handle request
  const { user } = request;

  try {
    await dataStorageRepository.create(user, params.projectKey, params);
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
    // Tag datastore as deleted but record will remain in db.
    await dataStorageRepository.update(request.user, params.projectKey, params.name, { status: DELETED });
    await volumeManager.deleteVolume(params);
    response.status(204);
    response.send({ message: 'OK' });
  } catch (error) {
    next(new Error(`Error deleting project: ${params.projectKey} volume: ${params.name}: ${error.message}`));
  }
}

async function queryVolume(request, response) {
  // Build request params
  const params = matchedData(request);

  // Handle request
  const volume = await volumeManager.queryVolume(params);
  response.send(volume);
}

async function listProjectActiveVolumes(request, response) {
  const { projectKey } = matchedData(request);
  const volumes = await dataStorageRepository.getAllProjectActive(request.user, projectKey);
  response.send(volumes);
}

async function getById(request, response) {
  const { projectKey, id } = matchedData(request);

  const volume = await dataStorageRepository.getById(request.user, projectKey, id);
  if (volume) {
    response.send(volume);
  } else {
    response.status(404).send();
  }
}

async function addUsers(request, response, next) {
  const { projectKey, name, userIds } = matchedData(request);

  try {
    const volume = await dataStorageRepository.addUsers(request.user, projectKey, name, userIds);
    response.send(volume);
  } catch (error) {
    next(new Error(`Unable to add users to project ${projectKey} volume ${name}: ${error.message}`));
  }
}

async function removeUsers(request, response, next) {
  const { projectKey, name, userIds } = matchedData(request);

  try {
    const volume = await dataStorageRepository.removeUsers(request.user, projectKey, name, userIds);
    response.send(volume);
  } catch (error) {
    next(new Error(`Unable to remove users from project ${projectKey} volume ${name}: ${error.message}`));
  }
}

async function updateVolume(request, response, next) {
  const matchedValues = matchedData(request);
  const { projectKey, name } = matchedValues;

  const updatedValues = USER_UPDATEABLE_FIELDS.reduce(
    (previousValue, field) => (
      matchedValues[field] !== undefined
        ? { ...previousValue, [field]: matchedValues[field] }
        : previousValue
    ),
    {},
  );

  try {
    const volume = await dataStorageRepository.update(
      request.user, projectKey, name, updatedValues,
    );
    response.send(volume);
  } catch (error) {
    next(new Error(`Error updating volume details - project: ${projectKey} volume: ${name}: ${error.message}`));
  }
}

const existsCheck = fieldName => check(fieldName)
  .exists()
  .withMessage(`${fieldName} must be specified`)
  .trim()
  .isLength({ min: 1 })
  .withMessage(`${fieldName} must have content`);

const nameCheck = existsCheck('name')
  .isAscii()
  .withMessage('Name must only use the characters a-z, 0-9')
  .isLength({ min: 4, max: 16 })
  .withMessage('Name must be 4-16 characters long');

const projectKeyCheck = existsCheck('projectKey');

const idCheck = existsCheck('id')
  .isMongoId()
  .withMessage('id must be specified as a Mongo Id');

const projectKeyValidator = service.middleware.validator([
  projectKeyCheck,
], logger);

const getByIdValidator = service.middleware.validator([
  projectKeyCheck,
  idCheck,
], logger);

const updateVolumeUserValidator = service.middleware.validator([
  projectKeyCheck,
  nameCheck,
  check('userIds').exists().withMessage('userIds must be specified'),
  existsCheck('userIds.*'),
], logger);

const allowedVolumeTypes = storageCreationAllowedTypes();
const createVolumeValidator = service.middleware.validator([
  projectKeyCheck,
  nameCheck,
  existsCheck('displayName'),
  existsCheck('description'),
  existsCheck('type')
    .exists()
    .isIn(allowedVolumeTypes)
    .withMessage(`Type must be one of ${allowedVolumeTypes}`),
  existsCheck('volumeSize')
    .isInt({ min: 5, max: 200 })
    .withMessage('Volume Size must be an integer between 5 and 200'),
], logger);

const deleteVolumeValidator = service.middleware.validator([
  projectKeyCheck,
  nameCheck,
], logger);

const queryVolumeValidator = service.middleware.validator([
  projectKeyCheck,
  nameCheck,
], logger);

const updateVolumeValidator = service.middleware.validator([
  projectKeyCheck,
  nameCheck,
  ...USER_UPDATEABLE_FIELDS.map(field => body(field).optional({ nullable: true })),
], logger);

export default {
  getByIdValidator,
  projectKeyValidator,
  createVolumeValidator,
  deleteVolumeValidator,
  queryVolumeValidator,
  updateVolumeUserValidator,
  updateVolumeValidator,
  createVolume,
  deleteVolume,
  queryVolume,
  getById,
  listProjectActiveVolumes,
  addUsers,
  removeUsers,
  updateVolume,
};
