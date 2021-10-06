import { join } from 'path';
import { imageCategory } from 'common/src/config/images';
import { stackTypes } from 'common';
import logger from '../config/logger';
import config from '../config/config';
import Stacks from './Stacks';
import stackRepository from '../dataaccess/stacksRepository';
import { status } from '../models/stackEnums';
import nameGenerator from '../common/nameGenerators';
import deploymentApi from '../kubernetes/deploymentApi';
import { mountAssetsOnDeployment } from './assets/assetManager';
import statusChecker from '../kubeWatcher/statusChecker';

const { isSingleHostName, basePath } = stackTypes;

async function createStack(user, params) {
  const { projectKey, name, type } = params;
  const stack = Stacks.getStack(type);

  if (!stack) {
    logger.error(`Could not create stack. No stack definition for type ${type}`);
    return Promise.reject({ message: `No stack definition for type ${type}` });
  }

  logger.info(`Creating new ${type} stack with name: ${name} for project: ${projectKey}`);

  const creationResponse = await stack.create(params);
  logger.info('About to mount assets');
  await mountAssetsOnStack(params);
  await stackRepository.createOrUpdate(
    projectKey,
    user,
    {
      ...params,
      category: imageCategory(type),
      status: status.REQUESTED,
      url: url(projectKey, name, type),
      internalEndpoint: `http://${params.type}-${name}.${projectKey}`,
    },
  );
  return creationResponse;
}

function url(projectKey, name, type) {
  const lab = config.get('datalabName');
  const domain = config.get('datalabDomain');
  const singleHostNameAndPath = join(`${lab}.${domain}`, basePath(type, projectKey, name));
  return isSingleHostName(type)
    ? `https://${singleHostNameAndPath}`
    : `https://${projectKey}-${name}.${domain}`;
}

const restartStack = async (params) => {
  const { projectKey, name, type } = params;
  validateStackType(params, 'restart');

  logger.info(`Restarting stack ${name} for project: ${projectKey}`);
  const k8sName = nameGenerator.deploymentName(name, type);
  return deploymentApi.restartDeployment(k8sName, projectKey);
};

const validateStackType = (params, actionDescription) => {
  const { projectKey, name, type } = params;
  const stack = Stacks.getStack(type);
  if (!stack) {
    logger.error(`Could not ${actionDescription} stack ${name} in project ${projectKey}. No stack definition for type ${type}`);
    throw new Error(`No stack definition for type ${type}`);
  }
};
const scaleUpStack = async (params) => {
  const { projectKey, name, type } = params;
  validateStackType(params, 'scale up');

  logger.info(`Scaling up stack ${name} for project: ${projectKey}`);
  const k8sName = nameGenerator.deploymentName(name, type);
  const response = await deploymentApi.scaleUpDeployment(k8sName, projectKey);

  // trigger a stack status check to push it into a creating state
  await statusChecker();
  return response;
};

const scaleDownStack = async (params) => {
  const { projectKey, name, type } = params;
  validateStackType(params, 'scale down');

  logger.info(`Scaling down stack ${name} for project: ${projectKey}`);
  const k8sName = nameGenerator.deploymentName(name, type);
  const response = await deploymentApi.scaleDownDeployment(k8sName, projectKey);

  // trigger a stack status check to push it into a suspended state
  await statusChecker();
  return response;
};

function deleteStack(user, params) {
  const { projectKey, name, type } = params;
  const stack = Stacks.getStack(type);

  if (!stack) {
    logger.error(`Could not delete stack. No stack definition for type ${type}`);
    return Promise.reject({ message: `No stack definition for type ${type}` });
  }

  logger.info(`Deleting stack ${name} for project: ${projectKey}`);
  return stack.delete(params)
    .then(response => stackRepository.deleteStack(projectKey, user, params)
      .then(() => response));
}

async function mountAssetsOnStack({ projectKey, name, type, assetIds }) {
  logger.info(`About to mount assets on Stack of type ${type} with name ${name} in project ${projectKey}`);

  const deploymentName = nameGenerator.deploymentName(name, type);
  // This is the index of the container that is actually running the stack, e.g. the Jupyter container,
  // rather than a supporting container. This is the container that needs to have the volumeMounts updated.
  const containerNameWithMounts = deploymentName;
  await mountAssetsOnDeployment({ projectKey, deploymentName, containerNameWithMounts, assetIds });
}

export default { createStack, scaleUpStack, scaleDownStack, restartStack, deleteStack, mountAssetsOnStack, url };
