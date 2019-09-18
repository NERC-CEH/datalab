import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProjectSchema = new Schema({
  projectKey: { type: String, required: true },
  name: String,
  description: String,
  collaborationLink: String,
});

mongoose.model('Project', ProjectSchema, 'projects');
