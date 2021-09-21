import { catalogueFileLocation, catalogueServer } from 'common/src/config/catalogue';
import { join } from 'path';
import deploymentApi from '../../kubernetes/deploymentApi';
import logger from '../../config/logger';
import nameGenerator from '../../common/nameGenerators';
import centralAssetRepoRepository from '../../dataaccess/centralAssetRepoRepository';

export const mountAssetsOnDeployment = async ({ projectKey, deploymentName, containerNameWithMounts, assetIds }) => {
  const deployment = await deploymentApi.getDeployment(deploymentName, projectKey);
  if (!deployment) {
    const errorMessage = `Could not mount assets on Stack. No deployment with name: ${deploymentName} in namespace: ${projectKey}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

  logger.info('Creating asset volume and volume mount arrays');
  const { assetVolumes, assetVolumeMounts } = await createAssetVolumeAndVolumeMountArrays(assetIds);

  const nonAssetVolumes = getDeploymentNonAssetVolumes(deployment);
  const volumes = [
    ...nonAssetVolumes,
    ...assetVolumes,
  ];

  const { containers } = deployment.spec.template.spec;
  // This is the index of the container that is actually using the mounts, e.g. the Jupyter container,
  // rather than a supporting container. This is the container that needs to have the volumeMounts updated.
  const stackContainerIndex = containers.findIndex(container => container.name === containerNameWithMounts);

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
};

const createAssetVolumeAndVolumeMountArrays = async (assetIds) => {
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
        path: join(storageLocation || '', fileLocation),
        readOnly: true,
      },
    });
    assetVolumeMounts.push({
      name: volumeName,
      mountPath: join('/assets', fileLocation),
      readOnly: true,
    });
  });

  return { assetVolumes, assetVolumeMounts };
};

const getDeploymentNonAssetVolumes = (deployment) => {
  const volumes = deployment.spec.template.spec.volumes || [];
  return volumes.filter(volume => !nameGenerator.isAssetVolume(volume.name));
};

const getContainerNonAssetVolumeMounts = (container) => {
  const volumeMounts = container.volumeMounts || [];
  return volumeMounts.filter(volumeMount => !nameGenerator.isAssetVolume(volumeMount.name));
};

export default { mountAssetsOnDeployment };
