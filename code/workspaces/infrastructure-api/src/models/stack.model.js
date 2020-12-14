import mongoose from 'mongoose';
import byUser from './queryHelper/filterByUser';
import byUserSharedVisible from './queryHelper/filterByUserSharedVisible';
import byProjectKey from './queryHelper/filterByProjectKey';
import byCategory from './queryHelper/filterByCategory';
import { getEnumValues, visibility, status, category } from './stackEnums';

const { Schema } = mongoose;

const StackSchema = new Schema({
  name: String,
  projectKey: String,
  displayName: String,
  type: String,
  description: String,
  url: String,
  internalEndpoint: String,
  users: [{ type: String, required: true }],
  category: { type: String, enum: getEnumValues(category), required: true },
  status: { type: String, enum: getEnumValues(status), default: status.REQUESTED },
  created: { type: Date, default: Date.now },
  shared: { type: String, enum: getEnumValues(visibility), default: visibility.PRIVATE },
  visible: { type: String, enum: getEnumValues(visibility), default: visibility.PRIVATE },
  volumeMount: String,
  version: { type: String, default: null },
});

StackSchema.query.filterByProject = byProjectKey.filterFind;
StackSchema.query.filterOneByProject = byProjectKey.filterFindOne;
StackSchema.query.filterByUser = byUser.filterFind;
StackSchema.query.filterOneByUser = byUser.filterFindOne;
StackSchema.query.filterByUserSharedVisible = byUserSharedVisible.filterFind;
StackSchema.query.filterOneByUserSharedVisible = byUserSharedVisible.filterFindOne;
StackSchema.query.filterByCategory = byCategory.filterFind;
mongoose.model('Stack', StackSchema);
