import { matchedData } from 'express-validator';
import centralAssetRepoRepository from '../dataaccess/centralAssetRepoRepository';
import stacksRepository from '../dataaccess/stacksRepository';
import centralAssetRepoModel from '../models/centralAssetMetadata.model';
import stackManager from '../stacks/stackManager';

const { PUBLIC, BY_PROJECT } = centralAssetRepoModel;

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

async function updateAssetMetadata(request, response, next) {
  const { assetId } = matchedData(request, { locations: ['params'] });
  const { ownerUserIds, visible, projectKeys } = matchedData(request, { locations: ['body'] });

  try {
    const exists = await centralAssetRepoRepository.assetIdExists(assetId);
    if (!exists) {
      next(new Error(`Can not update asset metadata - no document exists with assetId ${assetId}`));
    } else {
      await updateStacksForAsset(assetId, visible, projectKeys);
      // do db updates last in case k8s updates fail
      const updatedAsset = await centralAssetRepoRepository.updateMetadata({ assetId, ownerUserIds, visible, projectKeys });
      response.status(200).send(updatedAsset);
    }
  } catch (error) {
    next(new Error(`Error updating asset metadata - failed to update document: ${error.message}`));
  }
}

async function updateStacksForAsset(assetId, visible, projectKeys) {
  const stacksUsingAsset = await stacksRepository.getAllByAsset(assetId); // find the stacks using the asset
  const stacksNeedingUpdating = stacksUsingAsset.filter(stack => !stackCanUseAsset(stack.projectKey, visible, projectKeys)); // keep the ones which can't use the asset
  const modifiedStacks = stacksNeedingUpdating.map(stack => ({
    _id: stack._id, // eslint-disable-line no-underscore-dangle
    projectKey: stack.projectKey,
    name: stack.name,
    type: stack.type,
    assetIds: stack.assetIds ? stack.assetIds.filter(stackAssetId => stackAssetId !== assetId) : [], // remove asset from stack's asset IDs
  }));
  await Promise.all(modifiedStacks // update the stacks in k8s and the db. Do db updates last in case k8s updates fail.
    .map(stack => stackManager.mountAssetsOnStack(stack)
      .then(() => stacksRepository.updateAssets(stack._id, stack.assetIds)))); // eslint-disable-line no-underscore-dangle
}

function stackCanUseAsset(stackProjectKey, visible, projectKeys) {
  return visible === PUBLIC || (visible === BY_PROJECT && projectKeys && projectKeys.includes(stackProjectKey));
}

async function getAssetById(request, response, next) {
  const { assetId, projectKey } = matchedData(request);

  let assetArray;
  try {
    assetArray = await centralAssetRepoRepository.getMetadataWithIds([assetId]);
  } catch (error) {
    return next(new Error(`Error getting asset with assetId: ${assetId} - ${error.message}`));
  }

  if (assetArray.length === 0) return response.status(404).send();

  const [asset] = assetArray;
  if (
    asset.visible === PUBLIC
    || (asset.visible === BY_PROJECT && projectKey && asset.projectKeys.includes(projectKey))
  ) {
    return response.status(200).send(asset);
  }
  return response.status(404).send();
}

async function listAssetMetadata(request, response, next) {
  const { projectKey } = matchedData(request);

  try {
    const metadata = projectKey
      ? await centralAssetRepoRepository.metadataAvailableToProject(projectKey)
      : await centralAssetRepoRepository.listMetadata();
    return response.status(200).send(metadata);
  } catch (error) {
    return next(new Error(`Error listing asset metadata: ${error.message}`));
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

export default {
  createAssetMetadata,
  updateAssetMetadata,
  stackCanUseAsset,
  getAssetById,
  listAssetMetadata,
};
