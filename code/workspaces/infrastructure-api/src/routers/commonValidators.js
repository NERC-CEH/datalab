import { param } from 'express-validator';
import { service } from 'service-chassis';
import logger from '../config/logger';
import ValidationChainHelper from '../controllers/utils/validationChainHelper';

const paramProjectKeyValidator = () => service.middleware.validator([
  new ValidationChainHelper(param('projectKey'))
    .exists()
    .notEmpty()
    .getValidationChain(),
], logger);

export { paramProjectKeyValidator }; // eslint-disable-line import/prefer-default-export
