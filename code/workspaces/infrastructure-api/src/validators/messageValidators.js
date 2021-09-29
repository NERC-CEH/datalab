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

export default { messageValidator };

