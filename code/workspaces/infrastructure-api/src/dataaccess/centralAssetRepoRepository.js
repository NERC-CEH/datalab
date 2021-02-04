import database from '../config/database';
import centralAssetMetadataModel from '../models/centralAssetRepo.model';

const CentralAssetMetadata = () => database.getModel(centralAssetMetadataModel.modelName);

async function createMetadata(metadata) {
  const [document] = await CentralAssetMetadata().create([metadata], { setDefaultsOnInsert: true });
  return document;
}

async function metadataExists(metadata) {
  const checkingFunctions = [
    metadataWithNameVersionCombinationExists,
    metadataWithFileLocationExists,
    metadataWithMasterUrlMasterVersionCombinationExists,
  ];
  const results = await Promise.all(checkingFunctions.map(fn => fn(metadata)));
  return { conflicts: results.flatMap(result => result.conflicts) };
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

async function metadataWithMasterUrlMasterVersionCombinationExists({ masterUrl, masterVersion }) {
  const conflicts = [];
  if (masterUrl && await CentralAssetMetadata().exists({ masterUrl, masterVersion })) {
    // Don't need masterVersion if masterUrl already uniquely identifies resource so handle it potentially not being there
    if (masterVersion) {
      conflicts.push(`Metadata for asset with 'masterUrl:masterVersion' combination '${masterUrl}:${masterVersion}' already exists.`);
    } else {
      conflicts.push(`Metadata for asset with masterUrl '${masterUrl}' already exists.`);
    }
  }
  return { conflicts };
}

export default {
  createMetadata,
  metadataExists,
};
