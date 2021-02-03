import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';
import { assetTypes } from 'common/src/config/catalogue';

const modelName = 'CentralAssetMetadata';

const possibleTypeValues = () => assetTypes();
const possibleVisibleValues = () => ['public', 'byProject'];

const { Schema } = mongoose;

const CentralAssetMetadataSchema = new Schema({
  assetId: { type: String, required: true, default: uuid() },
  name: { type: String, required: true },
  version: { type: String, required: true },
  type: { type: String, enum: possibleTypeValues(), required: true },
  fileLocation: String,
  masterUrl: String,
  masterVersion: String,
  owners: { type: [String], required: true },
  visible: { type: String, enum: possibleVisibleValues(), required: true },
  projects: [String],
  registrationDate: { type: Date, default: Date.now(), required: true },
});

mongoose.model(modelName, CentralAssetMetadataSchema);

export default { modelName, possibleTypeValues, possibleVisibleValues };
