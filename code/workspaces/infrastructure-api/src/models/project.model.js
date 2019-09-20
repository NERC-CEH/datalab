import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProjectSchema = new Schema({
  key: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  collaborationLink: String,
});

mongoose.model('Project', ProjectSchema, 'projects');
