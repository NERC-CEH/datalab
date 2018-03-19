import mongoose from 'mongoose';
import filterByUser, { filterOneByUser } from './queryHelper/filterByUser';

const Schema = mongoose.Schema;

export const REQUESTED = 'requested';
export const CREATING = 'creating';
export const ANALYSIS = 'analysis';
export const PUBLISH = 'publish';

const states = [REQUESTED, CREATING];
const category = [ANALYSIS, PUBLISH];

const StackSchema = new Schema({
  name: String,
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

StackSchema.query.filterByUser = filterByUser;
StackSchema.query.filterOneByUser = filterOneByUser;
mongoose.model('Stack', StackSchema);
