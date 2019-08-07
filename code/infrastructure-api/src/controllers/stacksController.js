import { check, matchedData, sanitize } from 'express-validator';
import controllerHelper from './controllerHelper';
import stackRepository from '../dataaccess/stacksRepository';
import { mapHandleId } from '../dataaccess/renameIdHandler';
import { ANALYSIS, PUBLISH } from '../stacks/Stacks';

const TYPE = 'stacks';

function listStacks(request, response) {
  const { user } = request;
  return stackRepository.getAll(user)
    .then(mapHandleId)
    .then(stacks => response.send(stacks))
    .catch(controllerHelper.handleError(response, 'retrieving', TYPE, undefined));
}

function listByCategory(request, response) {
  const errorMessage = 'Invalid stacks fetch request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, listByCategoryExec);
}

function listByMount(request, response) {
  const errorMessage = 'Invalid stack fetch by Mount request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, listByMountExec);
}

function listByCategoryExec(request, response) {
  const { user } = request;
  const params = matchedData(request);
  return stackRepository.getAllByCategory(user, params.category)
    .then(mapHandleId)
    .then(stacks => response.send(stacks))
    .catch(controllerHelper.handleError(response, 'retrieving by type for', TYPE, undefined));
}

function listByMountExec(request, response) {
  // Build request params
  const { user } = request;
  const params = matchedData(request);

  // Handle request
  return stackRepository.getAllByVolumeMount(user, params.mount)
    .then(mapHandleId)
    .then(stack => response.send(stack))
    .catch(controllerHelper.handleError(response, 'matching mount for', TYPE, undefined));
}

const withCategoryValidator = [
  check('category', 'category must match known type')
    .exists()
    .isIn([ANALYSIS, PUBLISH])
    .trim(),
  sanitize(),
];

const withMountValidator = [
  check('mount', 'mount must be specified')
    .exists()
    .trim(),
];

export default { withCategoryValidator, withMountValidator, listStacks, listByCategory, listByMount };
