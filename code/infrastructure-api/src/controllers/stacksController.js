import { check } from 'express-validator/check';
import { matchedData, sanitize } from 'express-validator/filter';
import controllerHelper from './controllerHelper';
import stackRepository from '../dataaccess/stacksRepository';
import { mapHandleId } from '../dataaccess/renameIdHandler';
import { ANALYSIS, PUBLISH } from '../stacks/Stacks';

const TYPE = 'stacks';

function listStacks(request, response) {
  const { user } = request;
  return stackRepository.getAllForUser(user)
    .then(mapHandleId)
    .then(stacks => response.send(stacks))
    .catch(controllerHelper.handleError(response, 'retrieving', TYPE, undefined));
}

function listByCategory(request, response) {
  const errorMessage = 'Invalid stacks fetch request';
  return controllerHelper.validateAndExecute(request, response, errorMessage, listByCategoryExec);
}

function listByCategoryExec(request, response) {
  const { user } = request;
  const params = matchedData(request);
  return stackRepository.getAllForUserByCategory(user, params.category)
    .then(mapHandleId)
    .then(stacks => response.send(stacks))
    .catch(controllerHelper.handleError(response, 'retrieving by type', TYPE, undefined));
}

const coreStacksValidator = [
  sanitize('*').trim(),
];

const withCategoryValidator = [
  ...coreStacksValidator,
  check('category', 'category must match known type')
    .exists()
    .isIn([ANALYSIS, PUBLISH]),
];

export default { coreStacksValidator, withCategoryValidator, listStacks, listByCategory };
