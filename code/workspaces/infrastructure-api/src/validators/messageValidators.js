import { service } from 'service-chassis';
import logger from '../config/logger';
import ValidationChainHelper from './ValidationChainHelper';

const messageValidator = (checkFunction) => {
  const validations = [
    new ValidationChainHelper(checkFunction('message'))
      .exists()
      .notEmpty(),
    new ValidationChainHelper(checkFunction('expiry'))
      .exists()
      .notEmpty(),
  ];

  const validationChains = validations.map((validation) => {
    if (validation instanceof ValidationChainHelper) {
      return validation.getValidationChain();
    }
    return validation;
  });

  return service.middleware.validator(validationChains, logger);
};

const messageIdValidation = checkFunction => new ValidationChainHelper(checkFunction('id'))
  .exists()
  .notEmpty()
  .getValidationChain();
const messageIdValidator = checkFunction => service.middleware.validator([messageIdValidation(checkFunction)], logger);

export { messageValidator, messageIdValidator };
