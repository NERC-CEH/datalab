import { permissionTypes } from 'common';
import database from '../config/database';
import centralAssetMetadataModel from '../models/centralAssetMetadata.model';

const { PUBLIC, BY_PROJECT } = centralAssetMetadataModel;
const TYPE = 'centralAssetMetadata';

const { PROJECT_ADMIN_ROLE, PROJECT_USER_ROLE } = permissionTypes;

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
      { visible: PUBLIC },
      { visible: BY_PROJECT, projectKeys: { $elemMatch: { $eq: projectKey } } },
    ])
    .exec();
}

async function metadataAvailableToUser(userId, userRoles) {
  // Get a list of projects where this user is a user or admin.
  const allowedProjects = userRoles.map(r => (r.role === PROJECT_ADMIN_ROLE || r.role === PROJECT_USER_ROLE) && r.projectKey).filter(r => !!r);

  return CentralAssetMetadata()
    .find()
    .or([
      { visible: PUBLIC },
      { ownerUserIds: userId },
      { visible: BY_PROJECT, projectKeys: { $elemMatch: { $in: allowedProjects } } },
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
  metadataAvailableToUser,
  metadataExists,
  assetIdExists,
  setLastAddedDateToNow,
  deleteProject,
  TYPE,
};
