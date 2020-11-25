import { check, matchedData, sanitize } from 'express-validator';
import controllerHelper from './controllerHelper';
import stackRepository from '../dataaccess/stacksRepository';
import { mapHandleId } from '../dataaccess/renameIdHandler';
import { ANALYSIS, PUBLISH } from '../stacks/Stacks';

const TYPE = 'stacks';

function listStacks(request, response) {
  const { user } = request;
  return stackRepository.getAllByUser(user)
    .then(mapHandleId)
    .then(stacks => response.send(stacks))
    .catch(controllerHelper.handleError(response, 'retrieving', TYPE, undefined));
}

function listByProject(request, response) {
  const errorMessage = 'Invalid stacks fetch by project request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, listByProjectExec);
}

function listByCategory(request, response) {
  const errorMessage = 'Invalid stacks fetch by category request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, listByCategoryExec);
}

function listByMount(request, response) {
  const errorMessage = 'Invalid stack fetch by Mount request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, listByMountExec);
}

function listByProjectExec(request, response) {
  const { user } = request;
  const params = matchedData(request);
  return stackRepository.getAllByProject(params.projectKey, user)
    .then(mapHandleId)
    .then(stacks => response.send(stacks))
    .catch(controllerHelper.handleError(response, 'retrieving by project for', TYPE, undefined));
}

function listByCategoryExec(request, response) {
  const { user } = request;
  const params = matchedData(request);

  return stackRepository.getAllByCategory(params.projectKey, user, params.category)
    .then(mapHandleId)
    .then(stacks => response.send(stacks))
    .catch(controllerHelper.handleError(response, 'retrieving by category for', TYPE, undefined));
}

function listByMountExec(request, response) {
  const { user } = request;
  const params = matchedData(request);

  return stackRepository.getAllByVolumeMount(params.projectKey, user, params.mount)
    .then(mapHandleId)
    .then(stack => response.send(stack))
    .catch(controllerHelper.handleError(response, 'matching mount for', TYPE, undefined));
}

const withProjectValidator = [
  check('projectKey', "project 'projectKey' must be specified in URL")
    .exists()
    .trim(),
];

const withCategoryValidator = [
  ...withProjectValidator,
  check('category', 'category must match known type')
    .exists()
    .isIn([ANALYSIS, PUBLISH])
    .trim(),
  sanitize(),
];

const withMountValidator = [
  ...withProjectValidator,
  check('mount', 'mount must be specified')
    .exists()
    .trim(),
];

export default {
  withProjectValidator,
  withCategoryValidator,
  withMountValidator,
  listStacks,
  listByProject,
  listByCategory,
  listByMount,
};
