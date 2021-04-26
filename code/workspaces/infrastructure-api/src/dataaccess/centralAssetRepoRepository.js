import database from '../config/database';
import centralAssetMetadataModel from '../models/centralAssetMetadata.model';

const TYPE = 'centralAssetMetadata';

const CentralAssetMetadata = () => database.getModel(centralAssetMetadataModel.modelName);

async function createMetadata(metadata) {
  const [document] = await CentralAssetMetadata().create([metadata], { setDefaultsOnInsert: true });
  return document;
}

async function updateMetadata({ assetId, ownerUserIds, visible, projectKeys }) {
  const document = await CentralAssetMetadata().findOneAndUpdate(
    { assetId },
    { ownerUserIds, visible, projectKeys },
    { new: true },
  );
  return document;
}

async function listMetadata() {
  return CentralAssetMetadata().find().exec();
}

async function metadataAvailableToProject(projectKey) {
  return CentralAssetMetadata()
    .find()
    .or([
      { visible: 'PUBLIC' },
      { visible: 'BY_PROJECT', projectKeys: { $elemMatch: { $eq: projectKey } } },
    ])
    .exec();
}

async function getMetadataWithIds(ids) {
  return CentralAssetMetadata()
    .find()
    .where('assetId')
    .in(ids)
    .exec();
}

async function metadataExists(metadata) {
  const checkingFunctions = [
    metadataWithNameVersionCombinationExists,
    metadataWithFileLocationExists,
    metadataWithMasterUrlVersionCombinationExists,
  ];
  const results = await Promise.all(checkingFunctions.map(fn => fn(metadata)));
  const conflicts = results.flatMap(result => result.conflicts);
  return { conflicts, message: conflicts.join(' ') };
}

async function metadataWithNameVersionCombinationExists({ name, version }) {
  const conflicts = [];
  if (name && version && await CentralAssetMetadata().exists({ name, version })) {
    conflicts.push(`Metadata already exists with 'name:version' combination '${name}:${version}'.`);
  }
  return { conflicts };
}

async function metadataWithFileLocationExists({ fileLocation }) {
  const conflicts = [];
  if (fileLocation && await CentralAssetMetadata().exists({ fileLocation })) {
    conflicts.push(`Metadata for asset with fileLocation '${fileLocation}' already exists.`);
  }
  return { conflicts };
}

async function metadataWithMasterUrlVersionCombinationExists({ masterUrl, version }) {
  const conflicts = [];
  if (masterUrl && await CentralAssetMetadata().exists({ masterUrl, version })) {
    conflicts.push(`Metadata for asset with 'masterUrl:version' combination '${masterUrl}:${version}' already exists.`);
  }
  return { conflicts };
}

async function assetIdExists(assetId) {
  const exists = await CentralAssetMetadata().exists({ assetId });
  return exists;
}

async function setLastAddedDateToNow(assetIds) {
  return CentralAssetMetadata()
    .updateMany({ assetId: { $in: assetIds } }, { lastAddedDate: Date.now() })
    .exec();
}

async function deleteProject(projectKey) {
  // a project is being deleted, remove the projectKey from all assets
  return CentralAssetMetadata()
    .updateMany({}, { $pull: { projectKeys: { $in: [projectKey] } } })
    .exec();
}

export default {
  createMetadata,
  updateMetadata,
  listMetadata,
  getMetadataWithIds,
  metadataAvailableToProject,
  metadataExists,
  assetIdExists,
  setLastAddedDateToNow,
  deleteProject,
  TYPE,
};
