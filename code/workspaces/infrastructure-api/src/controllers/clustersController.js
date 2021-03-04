import { matchedData, body } from 'express-validator';
import { service } from 'service-chassis';
import clustersConfig from 'common/src/config/clusters';
import clustersRepository from '../dataaccess/clustersRepository';
import clusterModel from '../models/cluster.model';
import logger from '../config/logger';
import ValidationChainHelper from './utils/validationChainHelper';
import { createClusterStack } from '../stacks/clusterManager';

async function createCluster(request, response, next) {
  const cluster = matchedData(request);

  if (await handleExistingCluster(cluster, response, next)) return response;

  try {
    const createdCluster = await clustersRepository.createCluster(cluster);
    await createClusterStack(cluster);
    return response.status(201).send(createdCluster);
  } catch (error) {
    return next(new Error(`Error creating cluster - failed to create new document: ${error.message}`));
  }
}

async function handleExistingCluster(cluster, response, next) {
  try {
    const existErrors = await clustersRepository.clusterExists(cluster);
    if (existErrors) {
      return response.status(409).send({ message: existErrors });
    }
  } catch (error) {
    next(new Error(`Error creating cluster - failed to check if document already exists: ${error.message}`));
  }
  return null;
}

const range = limits => ({ min: limits.lowerLimit, max: limits.upperLimit });

const clusterValidator = () => {
  const validations = [
    new ValidationChainHelper(body('type'))
      .exists()
      .isIn(clusterModel.possibleTypeValues()),
    new ValidationChainHelper(body('projectKey'))
      .exists()
      .notEmpty(),
    new ValidationChainHelper(body('name'))
      .exists()
      .isName(),
    new ValidationChainHelper(body('displayName'))
      .exists()
      .notEmpty(),
    new ValidationChainHelper(body('volumeMount'))
      .optional()
      .notEmpty(),
    new ValidationChainHelper(body('condaPath'))
      .optional()
      .notEmpty(),
    new ValidationChainHelper(body('maxWorkers'))
      .exists()
      .isInIntRange(range(clustersConfig().dask.cluster.workersMax)),
    new ValidationChainHelper(body('maxWorkerMemoryGb'))
      .exists()
      .isInFloatRange(range(clustersConfig().dask.workers.memoryMax_GB)),
    new ValidationChainHelper(body('maxWorkerCpu'))
      .exists()
      .isInFloatRange(range(clustersConfig().dask.workers.CpuMax_vCPU)),
  ];

  const validationChains = validations.map((validation) => {
    if (validation instanceof ValidationChainHelper) {
      return validation.getValidationChain();
    }
    return validation;
  });

  return service.middleware.validator(validationChains, logger);
};

export default {
  createCluster,
  clusterValidator,
};
