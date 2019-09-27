import mongoose from 'mongoose';

const { Schema } = mongoose;

const ProjectSchema = new Schema({
  key: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  tags: { type: [String], default: [] },
  collaborationLink: { type: String, default: '' },
});

mongoose.model('Project', ProjectSchema, 'projects');
