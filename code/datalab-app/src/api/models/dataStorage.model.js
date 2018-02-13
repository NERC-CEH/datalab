import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const REQUESTED = 'requested';
export const CREATING = 'creating';
export const DELETED = 'deleted';

const states = [REQUESTED, CREATING, DELETED];

const DataStorageSchema = new Schema({
  name: String,
  displayName: String,
  description: String,
  type: Number,
  volumeSize: String,
  url: String,
  internalEndpoint: String,
  users: [{ type: String, required: true }],
  status: { type: String, enum: states, default: REQUESTED },
  created: { type: Date, default: Date.now },
});

mongoose.model('DataStorage', DataStorageSchema, 'dataStorage');
