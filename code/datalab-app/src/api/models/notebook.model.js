import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const NotebookSchema = new Schema({
  name: String,
  displayName: String,
  type: String,
  url: String,
  internalEndpoint: String,
  users: [String],
});

mongoose.model('Notebook', NotebookSchema);
