import { service } from 'service-chassis';
import clustersConfig from 'common/src/config/clusters';
import clusterModel from '../models/cluster.model';
import logger from '../config/logger';
import ValidationChainHelper from './ValidationChainHelper';
import { projectKeyValidation, nameValidation } from './commonValidators';

const range = limits => ({ min: limits.lowerLimit, max: limits.upperLimit });

const clusterTypeValidation = checkFunction => new ValidationChainHelper(checkFunction('type'))
  .exists()
  .isIn(clusterModel.possibleTypeValues())
  .getValidationChain();
export const clusterTypeValidator = checkFunction => service.middleware.validator([clusterTypeValidation(checkFunction)], logger);

const mountValidation = checkFunction => new ValidationChainHelper(checkFunction('volumeMount'))
  .exists()
  .getValidationChain();
export const mountValidator = checkFunction => service.middleware.validator([mountValidation(checkFunction)], logger);

export const clusterValidator = (checkFunction) => {
  const validations = [
    clusterTypeValidation(checkFunction),
    projectKeyValidation(checkFunction),
    nameValidation(checkFunction),
    new ValidationChainHelper(checkFunction('displayName'))
      .exists()
      .notEmpty(),
    new ValidationChainHelper(checkFunction('volumeMount'))
      .optional()
      .notEmpty(),
    new ValidationChainHelper(checkFunction('condaPath'))
      .optional()
      .notEmpty(),
    new ValidationChainHelper(checkFunction('maxWorkers'))
      .exists()
      .isInIntRange(range(clustersConfig().dask.cluster.workersMax)),
    new ValidationChainHelper(checkFunction('maxWorkerMemoryGb'))
      .exists()
      .isInFloatRange(range(clustersConfig().dask.workers.memoryMax_GB)),
    new ValidationChainHelper(checkFunction('maxWorkerCpu'))
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
