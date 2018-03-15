import { check } from 'express-validator/check';
import { sanitize } from 'express-validator/filter';
import controllerHelper from './controllerHelper';
import stackRepository from '../dataaccess/stacksRepository';

const TYPE = 'stacks';

function listStacks(request, response) {
  const { user } = request;
  return stackRepository.getAllForUser(user)
    .then(volumes => response.send(volumes))
    .catch(controllerHelper.handleError(response, 'retrieving', TYPE, undefined));
}

function checkName(request, response) {
  const { user, params } = request;
  return stackRepository.getAllByName(user, params.name)
    .then(volume => response.send(volume))
    .catch(controllerHelper.handleError(response, 'matching', TYPE, undefined));
}

const coreStacksValidator = [
  sanitize('*').trim(),
];

const checkNameValidator = [
  ...coreStacksValidator,
  check('name')
    .exists()
    .withMessage('Name must be specified')
    .isAscii()
    .withMessage('Name must only use the characters a-z')
    .isLength({ min: 4, max: 12 })
    .withMessage('Name must be 4-12 characters long'),
];

export default { coreStacksValidator, checkNameValidator, listStacks, checkName };
