import { param, query } from 'express-validator';
import { service } from 'service-chassis';
import logger from '../config/logger';
import ValidationChainHelper from '../controllers/utils/validationChainHelper';

export const paramProjectKeyValidator = () => service.middleware.validator([
  new ValidationChainHelper(param('projectKey'))
    .exists()
    .notEmpty()
    .getValidationChain(),
], logger);

export const queryProjectKeyValidator = () => service.middleware.validator([
  new ValidationChainHelper(query('projectKey'))
    .exists()
    .notEmpty()
    .getValidationChain(),
], logger);
