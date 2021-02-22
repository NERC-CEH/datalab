import { matchedData, body, param } from 'express-validator';
import { service } from 'service-chassis';
import centralAssetRepoRepository from '../dataaccess/centralAssetRepoRepository';
import centralAssetRepoModel from '../models/centralAssetRepo.model';
import logger from '../config/logger';
import ValidationChainHelper from './utils/validationChainHelper';

async function createAssetMetadata(request, response, next) {
  const metadata = matchedData(request);

  if (handleMissingResourceLocator(metadata, response)) return response;
  if (await handleExistingMetadata(metadata, response, next)) return response;

  try {
    const createdMetadata = await centralAssetRepoRepository.createMetadata(metadata);
    return response.status(201).send(createdMetadata);
  } catch (error) {
    return next(new Error(`Error creating asset metadata - failed to create new document: ${error.message}`));
  }
}

async function listAssetMetadata(request, response, next) {
  try {
    const metadata = await centralAssetRepoRepository.listMetadata();
    return response.status(200).send(metadata);
  } catch (error) {
    return next(new Error(`Error listing asset metadata: ${error.message}`));
  }
}

async function assetMetadataAvailableToProject(request, response, next) {
  const { projectKey } = matchedData(request);

  try {
    const metadata = await centralAssetRepoRepository.metadataAvailableToProject(projectKey);
    return response.status(200).send(metadata);
  } catch (error) {
    return next(new Error(`Error listing asset metadata by key: ${error.message}`));
  }
}

function handleMissingResourceLocator(metadata, response) {
  const { fileLocation, masterUrl } = metadata;
  if (!(fileLocation || masterUrl)) {
    return response
      .status(400)
      .send({
        error: "One of 'fileLocation' or 'masterUrl' must be defined.",
      });
  }
  return null;
}

async function handleExistingMetadata(metadata, response, next) {
  try {
    const documentForAssetExists = await centralAssetRepoRepository.metadataExists(metadata);
    if (documentForAssetExists.conflicts.length > 0) {
      return response.status(409).send(documentForAssetExists);
    }
  } catch (error) {
    next(new Error(`Error creating asset metadata - failed to check if document already exists: ${error.message}`));
  }
  return null;
}

const metadataValidator = () => {
  const validations = [
    new ValidationChainHelper(body('name'))
      .exists()
      .notEmpty(),
    new ValidationChainHelper(body('version'))
      .exists()
      .notEmpty(),
    new ValidationChainHelper(body('type'))
      .exists()
      .isIn(centralAssetRepoModel.possibleTypeValues()),
    new ValidationChainHelper(body('fileLocation'))
      .optional()
      .notEmpty(),
    new ValidationChainHelper(body('masterUrl'))
      .optional()
      .notEmpty()
      .isUrl(),
    new ValidationChainHelper(body('masterVersion'))
      .optional()
      .notEmpty(),
    new ValidationChainHelper(body('ownerUserIds'))
      .exists()
      .isArray(),
    new ValidationChainHelper(body('visible'))
      .exists()
      .isIn(centralAssetRepoModel.possibleVisibleValues()),
    new ValidationChainHelper(body('projectKeys'))
      .optional()
      .isArray(),
  ];

  const validationChains = validations.map((validation) => {
    if (validation instanceof ValidationChainHelper) {
      return validation.getValidationChain();
    }
    return validation;
  });

  return service.middleware.validator(validationChains, logger);
};

const listByProjectKeyValidator = () => service.middleware.validator([
  new ValidationChainHelper(param('projectKey'))
    .exists()
    .notEmpty()
    .getValidationChain(),
], logger);

export default {
  createAssetMetadata,
  listAssetMetadata,
  assetMetadataAvailableToProject,
  metadataValidator,
  listByProjectKeyValidator,
};
