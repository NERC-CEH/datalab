import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const REQUESTED = 'requested';
export const CREATING = 'creating';
const states = [REQUESTED, CREATING];

const NotebookSchema = new Schema({
  name: String,
  displayName: String,
  type: String,
  url: String,
  internalEndpoint: String,
  users: [String],
  status: { type: String, enum: states, default: REQUESTED },
  created: { type: Date, default: Date.now },
});

mongoose.model('Notebook', NotebookSchema);
