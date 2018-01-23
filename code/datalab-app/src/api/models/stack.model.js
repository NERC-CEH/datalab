import mongoose from 'mongoose';

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
  users: [String],
  category: { type: String, enum: category, required: true },
  status: { type: String, enum: states, default: REQUESTED },
  created: { type: Date, default: Date.now },
  volumeMount: String,
});

mongoose.model('Stack', StackSchema);
