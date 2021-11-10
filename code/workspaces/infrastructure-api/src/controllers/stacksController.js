import { check, matchedData, body } from 'express-validator';
import { NOTEBOOK_CATEGORY, SITE_CATEGORY } from 'common/src/config/images';
import controllerHelper from './controllerHelper';
import stackRepository from '../dataaccess/stacksRepository';

const TYPE = 'stacks';

function listStacks(request, response) {
  const { user } = request;
  return stackRepository.getAllByUser(user)
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

const listByProjectExec = async (request, response) => {
  const { user } = request;
  const params = matchedData(request);
  try {
    const stacks = await stackRepository.getAllByProject(params.projectKey, user);
    response.send(stacks);
  } catch (error) {
    controllerHelper.handleError(response, 'retrieving by project for', TYPE, undefined)(error);
  }
};

const listByCategoryExec = async (request, response) => {
  const { user } = request;
  const params = matchedData(request);

  try {
    const stacks = await stackRepository.getAllByCategory(params.projectKey, user, params.category);
    response.send(stacks);
  } catch (error) {
    controllerHelper.handleError(response, 'retrieving by category for', TYPE, undefined)(error);
  }
};

function listByMountExec(request, response) {
  const { user } = request;
  const params = matchedData(request);

  return stackRepository.getAllByVolumeMountAnonymised(params.projectKey, user, params.mount)
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
    .isIn([NOTEBOOK_CATEGORY, SITE_CATEGORY])
    .trim(),
  body(),
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
