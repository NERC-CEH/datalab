import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const REQUESTED = 'requested';
export const CREATING = 'creating';

const states = [REQUESTED, CREATING];

const DataStorageSchema = new Schema({
  name: String,
  displayName: String,
  description: String,
  type: Number,
  volumeSize: String,
  url: String,
  internalEndpoint: String,
  users: [String],
  status: { type: String, enum: states, default: REQUESTED },
  created: { type: Date, default: Date.now },
});

mongoose.model('DataStorage', DataStorageSchema, 'dataStorage');
