import { service } from 'service-chassis';
import logger from '../config/logger';
import ValidationChainHelper from '../validators/ValidationChainHelper';

const notificationValidator = (checkFunction) => {
  const validations = [
    new ValidationChainHelper(checkFunction('message'))
      .exists()
      .notEmpty(),
    new ValidationChainHelper(checkFunction('title'))
      .exists()
      .notEmpty(),
    new ValidationChainHelper(checkFunction('userIDs'))
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

const notificationIdValidation = checkFunction => new ValidationChainHelper(checkFunction('id'))
  .exists()
  .notEmpty()
  .getValidationChain();
const notificationIdValidator = checkFunction => service.middleware.validator([notificationIdValidation(checkFunction)], logger);

export { notificationValidator, notificationIdValidator };
