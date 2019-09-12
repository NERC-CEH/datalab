import mongoose from 'mongoose';
import byUser from './queryHelper/filterByUser';

const { Schema } = mongoose;

export const REQUESTED = 'requested';
export const CREATING = 'creating';
export const READY = 'ready';
export const UNAVAILABLE = 'unavailable';
export const ANALYSIS = 'analysis';
export const PUBLISH = 'publish';

const states = [REQUESTED, CREATING, READY, UNAVAILABLE];
const category = [ANALYSIS, PUBLISH];

const StackSchema = new Schema({
  name: String,
  projectKey: String,
  displayName: String,
  type: String,
  description: String,
  url: String,
  internalEndpoint: String,
  users: [{ type: String, required: true }],
  category: { type: String, enum: category, required: true },
  status: { type: String, enum: states, default: REQUESTED },
  created: { type: Date, default: Date.now },
  volumeMount: String,
});

StackSchema.query.filterByUser = byUser.filterFind;
StackSchema.query.filterOneByUser = byUser.filterFindOne;
mongoose.model('Stack', StackSchema);
