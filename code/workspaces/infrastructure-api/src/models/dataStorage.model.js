import mongoose from 'mongoose';

const { Schema } = mongoose;

export const REQUESTED = 'requested';
export const CREATING = 'creating';
export const DELETED = 'deleted';

const states = [REQUESTED, CREATING, DELETED];

export const LEGACY_GLUSTERFS = '1';
export const GLUSTERFS = 'glusterfs';
export const NFS = 'nfs';

const storageTypes = [LEGACY_GLUSTERFS, GLUSTERFS, NFS];

const DataStorageSchema = new Schema({
  name: String,
  projectKey: String,
  displayName: String,
  description: String,
  type: { type: String, enum: storageTypes, default: GLUSTERFS },
  volumeSize: String,
  url: String,
  internalEndpoint: String,
  users: [{ type: String, required: true }],
  status: { type: String, enum: states, default: REQUESTED },
  created: { type: Date, default: Date.now },
});

mongoose.model('DataStorage', DataStorageSchema, 'dataStorage');
