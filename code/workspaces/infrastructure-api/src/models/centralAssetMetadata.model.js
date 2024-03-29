import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

const modelName = 'CentralAssetMetadata';

const PUBLIC = 'PUBLIC';
const BY_PROJECT = 'BY_PROJECT';
const possibleVisibleValues = () => [PUBLIC, BY_PROJECT];
const possibleLicenseValues = () => ['OGL'];
const possiblePublisherValues = ['EIDC'];

const { Schema } = mongoose;

const CentralAssetMetadataSchema = new Schema({
  assetId: { type: String, required: true, default: uuid },
  name: { type: String, required: true },
  version: { type: String, required: true },
  fileLocation: String,
  masterUrl: String,
  ownerUserIds: { type: [String], required: true },
  visible: { type: String, enum: possibleVisibleValues(), required: true },
  projectKeys: [String],
  registrationDate: { type: Date, default: Date.now, required: true },
  lastAddedDate: Date,
  license: { type: String, enum: possibleLicenseValues(), default: undefined },
  publisher: { type: String, enum: possiblePublisherValues, default: undefined },
  citationString: { type: String, default: undefined },
});

mongoose.model(modelName, CentralAssetMetadataSchema);

export default { modelName, possibleVisibleValues, possibleLicenseValues, possiblePublisherValues, PUBLIC, BY_PROJECT };
