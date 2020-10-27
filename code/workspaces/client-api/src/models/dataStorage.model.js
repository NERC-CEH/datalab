import mongoose from 'mongoose';
import { storageTypes } from 'common/src/config/storage';

const { Schema } = mongoose;

export const REQUESTED = 'requested';
export const CREATING = 'creating';
export const DELETED = 'deleted';

const states = [REQUESTED, CREATING, DELETED];

const DataStorageSchema = new Schema({
  name: String,
  projectKey: String,
  displayName: String,
  description: String,
  type: { type: String, enum: storageTypes },
  volumeSize: String,
  url: String,
  internalEndpoint: String,
  users: [{ type: String, required: true }],
  status: { type: String, enum: states, default: REQUESTED },
  created: { type: Date, default: Date.now },
});

mongoose.model('DataStorage', DataStorageSchema, 'dataStorage');
