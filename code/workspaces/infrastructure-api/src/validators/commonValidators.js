import { service } from 'service-chassis';
import logger from '../config/logger';
import ValidationChainHelper from './ValidationChainHelper';

export const nameValidation = checkFunction => new ValidationChainHelper(checkFunction('name'))
  .exists()
  .isName()
  .getValidationChain();
export const nameValidator = checkFunction => service.middleware.validator([nameValidation(checkFunction)], logger);

export const projectKeyValidation = checkFunction => new ValidationChainHelper(checkFunction('projectKey'))
  .exists()
  .notEmpty()
  .getValidationChain();
export const projectKeyValidator = checkFunction => service.middleware.validator([projectKeyValidation(checkFunction)], logger);

export const optionalProjectKeyValidation = checkFunction => new ValidationChainHelper(checkFunction('projectKey'))
  .optional()
  .notEmpty()
  .getValidationChain();
export const optionalProjectKeyValidator = checkFunction => service.middleware.validator([optionalProjectKeyValidation(checkFunction)], logger);
