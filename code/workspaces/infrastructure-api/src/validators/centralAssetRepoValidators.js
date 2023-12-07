import { service } from 'service-chassis';
import logger from '../config/logger';
import centralAssetRepoModel from '../models/centralAssetMetadata.model';
import ValidationChainHelper from './ValidationChainHelper';

const assetIdValidation = checkFunction => new ValidationChainHelper(checkFunction('assetId'))
  .exists()
  .isUUIDv4()
  .getValidationChain();
export const assetIdValidator = checkFunction => service.middleware.validator([assetIdValidation(checkFunction)], logger);

export const createValidator = (checkFunction) => {
  const validations = [
    new ValidationChainHelper(checkFunction('name'))
      .exists()
      .notEmpty(),
    new ValidationChainHelper(checkFunction('version'))
      .exists()
      .notEmpty(),
    new ValidationChainHelper(checkFunction('fileLocation'))
      .optional()
      .notEmpty(),
    new ValidationChainHelper(checkFunction('masterUrl'))
      .optional()
      .notEmpty()
      .isUrl(),
    new ValidationChainHelper(checkFunction('ownerUserIds'))
      .exists()
      .isArray(),
    new ValidationChainHelper(checkFunction('visible'))
      .exists()
      .isIn(centralAssetRepoModel.possibleVisibleValues()),
    new ValidationChainHelper(checkFunction('projectKeys'))
      .optional()
      .isArray(),
    new ValidationChainHelper(checkFunction('license'))
      .optional()
      .isIn(centralAssetRepoModel.possibleLicenseValues()),
    new ValidationChainHelper(checkFunction('publisher'))
      .optional()
      .isIn(centralAssetRepoModel.possiblePublisherValues),
    new ValidationChainHelper(checkFunction('citationString'))
      .optional()
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

export const updateValidator = (checkFunction) => {
  const validations = [
    new ValidationChainHelper(checkFunction('ownerUserIds'))
      .exists()
      .isArray(),
    new ValidationChainHelper(checkFunction('visible'))
      .exists()
      .isIn(centralAssetRepoModel.possibleVisibleValues()),
    new ValidationChainHelper(checkFunction('projectKeys'))
      .optional()
      .isArray(),
    new ValidationChainHelper(checkFunction('license'))
      .optional()
      .isIn(centralAssetRepoModel.possibleLicenseValues()),
    new ValidationChainHelper(checkFunction('publisher'))
      .optional()
      .isIn(centralAssetRepoModel.possiblePublisherValues),
    new ValidationChainHelper(checkFunction('citationString'))
      .optional()
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
