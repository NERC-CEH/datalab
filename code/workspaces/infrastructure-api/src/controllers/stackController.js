import { body, check, matchedData } from 'express-validator';
import { isBoolean, indexOf } from 'lodash';
import { notebookList, siteList, versionList } from 'common/src/config/images';
import controllerHelper from './controllerHelper';
import stackRepository from '../dataaccess/stacksRepository';
import stackManager from '../stacks/stackManager';
import { visibility, getEnumValues } from '../models/stackEnums';

const TYPE = 'stack';
const USER_UPDATEABLE_FIELDS = ['displayName', 'description', 'shared'];
const STACK_SHARED_VALUES = ['private', 'project', 'public'];

function createStack(request, response) {
  const errorMessage = 'Invalid stack creation request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, createStackExec);
}

function restartStack(request, response) {
  const errorMessage = 'Invalid stack restart request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, restartStackExec);
}

function deleteStack(request, response) {
  const errorMessage = 'Invalid stack deletion request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, deleteStackExec);
}

function updateStack(request, response) {
  const errorMessage = 'Invalid stack update request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, updateStackExec);
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
    .then(stack => response.send(stack))
    .catch(controllerHelper.handleError(response, 'matching ID for', TYPE, undefined));
}

function getOneByNameExec(request, response) {
  // Build request params
  const { user } = request;
  const params = matchedData(request);

  // Handle request
  return stackRepository.getOneByName(params.projectKey, user, params.name)
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

function updateStackExec(request, response) {
  // Build request params
  const { user } = request;
  const params = matchedData(request);
  const { projectKey, name } = params;

  const updatedDetails = USER_UPDATEABLE_FIELDS.reduce(
    (previousValue, field) => (
      params[field] !== undefined
        ? { ...previousValue, [field]: params[field] }
        : previousValue
    ),
    {},
  );

  // Handle request
  return stackRepository.update(projectKey, user, name, updatedDetails)
    .then(res => response.send(res))
    .catch(controllerHelper.handleError(response, 'updating', TYPE, name));
}

function restartStackExec(request, response) {
  // Build request params
  const { user } = request;
  const params = matchedData(request);

  const { projectKey, name } = params;

  return stackRepository.userCanRestartStack(projectKey, user, name)
    .then((result) => {
      if (result) {
        // Handle request
        return stackManager.restartStack(params)
          .then(controllerHelper.sendSuccessfulRestart(response))
          .catch(controllerHelper.handleError(response, 'restarting', TYPE, params.name));
      }
      return Promise.reject(new Error('User cannot restart stack.'));
    })
    .catch(controllerHelper.handleError(response, 'restarting', TYPE, params.name));
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
      return Promise.reject(new Error('User cannot delete stack'));
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
    .withMessage('Name must only use the characters a-z, 0-9')
    .isLength({ min: 4, max: 16 })
    .withMessage('Name must be 4-16 characters long'),
];

const deleteStackValidator = [
  ...withNameValidator,
  checkExistsWithMsg('datalabInfo.domain'),
  checkExistsWithMsg('datalabInfo.name'),
  checkExistsWithMsg('type'),
];

const restartStackValidator = [
  ...withNameValidator,
  checkExistsWithMsg('type'),
];

const updateStackValidator = [
  checkExistsWithMsg('name'),
  checkExistsWithMsg('projectKey'),
  ...USER_UPDATEABLE_FIELDS.map(field => body(field).optional({ nullable: true })),
  body('shared')
    .optional({ nullable: true })
    .isIn(STACK_SHARED_VALUES)
    .withMessage(`Value of "shared" must be one of: ${STACK_SHARED_VALUES.map(value => `"${value}"`).join(', ')}.`),
];

const createStackValidator = [
  ...deleteStackValidator,
  check('sourcePath', 'sourcePath must be specified for publication request')
    .custom((value, { req }) => {
      if (indexOf(siteList(), req.body.type) > -1) {
        return value;
      }
      return true;
    }),
  check('isPublic', 'isPublic boolean must be specified for publication request')
    .custom((value, { req }) => {
      if (indexOf(siteList(), req.body.type) > -1) {
        return isBoolean(value);
      }
      return true;
    }),
  check('visible', 'visible must be specified for sites')
    .custom((value, { req }) => {
      if (siteList().includes(req.body.type)) {
        return getEnumValues(visibility).includes(req.body.visible);
      }
      return true;
    }),
  check('shared', 'shared must be specified for notebooks')
    .custom((value, { req }) => {
      if (notebookList().includes(req.body.type)) {
        return getEnumValues(visibility).includes(req.body.shared);
      }
      return true;
    }),
  check('version', 'valid version must be specified')
    .optional()
    .custom((value, { req }) => {
      if (notebookList().includes(req.body.type)) {
        return versionList(req.body.type).includes(value);
      }
      return true;
    })
    .withMessage((value, { req }) => `Must be one of ${versionList(req.body.type)}.`),
  checkExistsWithMsg('description'),
  checkExistsWithMsg('displayName'),
  checkExistsWithMsg('volumeMount'),
];

const validators = {
  withIdValidator,
  withNameValidator,
  deleteStackValidator,
  createStackValidator,
  updateStackValidator,
  restartStackValidator,
};

const controllers = { getOneById, getOneByName, createStack, restartStack, deleteStack, updateStack };

export default { ...validators, ...controllers };
