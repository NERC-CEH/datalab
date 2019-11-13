import { check, matchedData } from 'express-validator';
import { isBoolean, indexOf } from 'lodash';
import controllerHelper from './controllerHelper';
import stackRepository from '../dataaccess/stacksRepository';
import stackManager from '../stacks/stackManager';
import handleId from '../dataaccess/renameIdHandler';
import Stacks, { PUBLISH, ANALYSIS } from '../stacks/Stacks';
import { visibility, getEnumValues } from '../models/stackEnums';

const TYPE = 'stack';

function createStack(request, response) {
  const errorMessage = 'Invalid stack creation request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, createStackExec);
}

function deleteStack(request, response) {
  const errorMessage = 'Invalid stack deletion request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, deleteStackExec);
}

function getOneById(request, response) {
  const errorMessage = 'Invalid stack fetch by ID request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, getOneByIdExec);
}

function getOneByName(request, response) {
  const errorMessage = 'Invalid stack fetch by Name request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, getOneByNameExec);
}

function getOneByIdExec(request, response) {
  // Build request params
  const { user } = request;
  const params = matchedData(request);

  // Handle request
  return stackRepository.getOneById(params.projectKey, user, params.id)
    .then(handleId)
    .then(stack => response.send(stack))
    .catch(controllerHelper.handleError(response, 'matching ID for', TYPE, undefined));
}

function getOneByNameExec(request, response) {
  // Build request params
  const { user } = request;
  const params = matchedData(request);

  // Handle request
  return stackRepository.getOneByName(params.projectKey, user, params.name)
    .then(handleId)
    .then(stack => response.send(stack))
    .catch(controllerHelper.handleError(response, 'matching Name for', TYPE, undefined));
}

function createStackExec(request, response) {
  // Build request params
  const { user } = request;
  const params = matchedData(request);

  // Handle request
  return stackManager.createStack(user, params)
    .then(controllerHelper.sendSuccessfulCreation(response))
    .catch(controllerHelper.handleError(response, 'creating', TYPE, params.name));
}

function deleteStackExec(request, response) {
  // Build request params
  const { user } = request;
  const params = matchedData(request);

  const { projectKey, name } = params;

  return stackRepository.userCanDeleteStack(projectKey, user, name)
    .then((result) => {
      if (result) {
        // Handle request
        return stackManager.deleteStack(user, params)
          .then(controllerHelper.sendSuccessfulDeletion(response))
          .catch(controllerHelper.handleError(response, 'deleting', TYPE, params.name));
      }
      return Promise.reject();
    })
    .catch(controllerHelper.handleError(response, 'deleting', TYPE, params.name));
}

const checkExistsWithMsg = fieldName => check(fieldName).exists().withMessage(`${fieldName} must be specified`).trim();

const withIdValidator = [
  checkExistsWithMsg('id'),
  checkExistsWithMsg('projectKey'),
];

const withNameValidator = [
  checkExistsWithMsg('projectKey'),
  checkExistsWithMsg('name')
    .isAscii()
    .withMessage('Name must only use the characters a-z')
    .isLength({ min: 4, max: 12 })
    .withMessage('Name must be 4-12 characters long'),
];

const deleteStackValidator = [
  ...withNameValidator,
  checkExistsWithMsg('datalabInfo.domain'),
  checkExistsWithMsg('datalabInfo.name'),
  checkExistsWithMsg('type'),
];

const createStackValidator = [
  ...deleteStackValidator,
  check('sourcePath', 'sourcePath must be specified for publication request')
    .custom((value, { req }) => {
      if (indexOf(Stacks.getNamesByCategory(PUBLISH), req.body.type) > -1) {
        return value;
      }
      return true;
    }),
  check('isPublic', 'isPublic boolean must be specified for publication request')
    .custom((value, { req }) => {
      if (indexOf(Stacks.getNamesByCategory(PUBLISH), req.body.type) > -1) {
        return isBoolean(value);
      }
      return true;
    }),
  check('visible', 'visible must be specified for sites')
    .custom((value, { req }) => {
      if (Stacks.getNamesByCategory(PUBLISH).includes(req.body.type)) {
        return getEnumValues(visibility).includes(req.body.visible);
      }
      return true;
    }),
  check('shared', 'shared must be specified for notebooks')
    .custom((value, { req }) => {
      if (Stacks.getNamesByCategory(ANALYSIS).includes(req.body.type)) {
        return getEnumValues(visibility).includes(req.body.shared);
      }
      return true;
    }),
  checkExistsWithMsg('description'),
  checkExistsWithMsg('displayName'),
  checkExistsWithMsg('volumeMount'),
];

const validators = { withIdValidator, withNameValidator, deleteStackValidator, createStackValidator };

const controllers = { getOneById, getOneByName, createStack, deleteStack };

export default { ...validators, ...controllers };
