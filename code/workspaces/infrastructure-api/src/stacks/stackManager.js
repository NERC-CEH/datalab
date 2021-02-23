import path from 'path';
import { imageCategory } from 'common/src/config/images';
import { catalogueFileLocation, catalogueServer } from 'common/src/config/catalogue';
import logger from '../config/logger';
import config from '../config/config';
import Stacks from './Stacks';
import stackRepository from '../dataaccess/stacksRepository';
import { status } from '../models/stackEnums';
import nameGenerator from '../common/nameGenerators';
import deploymentApi from '../kubernetes/deploymentApi';
import centralAssetRepoRepository from '../dataaccess/centralAssetRepoRepository';

async function createStack(user, params) {
  const { projectKey, name, type } = params;
  const stack = Stacks.getStack(type);

  if (!stack) {
    logger.error(`Could not create stack. No stack definition for type ${type}`);
    return Promise.reject({ message: `No stack definition for type ${type}` });
  }

  logger.info(`Creating new ${type} stack with name: ${name} for project: ${projectKey}`);

  const creationResponse = await stack.create(params);
  await mountAssetsOnStack(params);
  await stackRepository.createOrUpdate(
    projectKey,
    user,
    {
      ...params,
      category: imageCategory(type),
      status: status.REQUESTED,
      url: `https://${projectKey}-${name}.${config.get('datalabDomain')}`,
      internalEndpoint: `http://${params.type}-${name}.${projectKey}`,
    },
  );
  return creationResponse;
}

function restartStack(params) {
  const { projectKey, name, type } = params;

  // ensure type is valid
  const stack = Stacks.getStack(type);
  if (!stack) {
    logger.error(`Could not restart stack ${name} in project ${projectKey}. No stack definition for type ${type}`);
    return Promise.reject({ message: `No stack definition for type ${type}` });
  }

  logger.info(`Restarting stack ${name} for project: ${projectKey}`);
  const k8sName = nameGenerator.deploymentName(name, type);
  return deploymentApi.restartDeployment(k8sName, projectKey);
}

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
  logger.debug(`About to mount assets on Stack of type ${type} with name ${name} in project ${projectKey}`);

  const deploymentName = nameGenerator.deploymentName(name, type);
  const deployment = await deploymentApi.getDeployment(deploymentName, projectKey);
  if (!deployment) {
    const errorMessage = `Could not mount assets on Stack. No stack deployment with name: ${deploymentName} in namespace: ${projectKey}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  const { assetVolumes, assetVolumeMounts } = await createAssetVolumeAndVolumeMountArrays(assetIds);

  const nonAssetVolumes = getDeploymentNonAssetVolumes(deployment);
  const volumes = [
    ...nonAssetVolumes,
    ...assetVolumes,
  ];

  const { containers } = deployment.spec.template.spec;
  // This is the index of the container that is actually running the stack, e.g. the Jupyter container,
  // rather than a supporting container. This is the container that needs to have the volumeMounts updated.
  const stackContainerIndex = containers.findIndex(container => container.name === deploymentName);
  const nonAssetVolumeMounts = getContainerNonAssetVolumeMounts(containers[stackContainerIndex]);
  containers[stackContainerIndex].volumeMounts = [
    ...nonAssetVolumeMounts,
    ...assetVolumeMounts,
  ];

  // specify the new values that the volumes and containers arrays should have. Need to pass
  // the whole array (including elements that haven't been updated) due to how a
  // JSON merge patch works.
  const mergePatchBody = {
    spec: { template: { spec: { volumes, containers } } },
  };
  await deploymentApi.mergePatchDeployment(deploymentName, projectKey, mergePatchBody);
}

async function createAssetVolumeAndVolumeMountArrays(assetIds) {
  const storageServer = catalogueServer();
  const storageLocation = catalogueFileLocation();

  const assetMetadata = await centralAssetRepoRepository.getMetadataWithIds(assetIds);

  const assetVolumes = [];
  const assetVolumeMounts = [];
  assetMetadata.forEach((asset) => {
    const volumeName = nameGenerator.assetVolume(asset.assetId);
    const fileLocation = asset.fileLocation.replace(/^\//, '');
    assetVolumes.push({
      name: volumeName,
      nfs: {
        server: storageServer,
        path: path.join(storageLocation, fileLocation),
        readOnly: true,
      },
    });
    assetVolumeMounts.push({
      name: volumeName,
      mountPath: path.join('/assets', fileLocation),
      readOnly: true,
    });
  });

  return { assetVolumes, assetVolumeMounts };
}

function getDeploymentNonAssetVolumes(deployment) {
  const volumes = deployment.spec.template.spec.volumes || [];
  return volumes.filter(volume => !nameGenerator.isAssetVolume(volume.name));
}

function getContainerNonAssetVolumeMounts(container) {
  const volumeMounts = container.volumeMounts || [];
  return volumeMounts.filter(volumeMount => !nameGenerator.isAssetVolume(volumeMount.name));
}

export default { createStack, restartStack, deleteStack, mountAssetsOnStack };
