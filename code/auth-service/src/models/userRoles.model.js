import mongoose from 'mongoose';

const { Schema } = mongoose;

export const INSTANCE_ADMIN = 'instance-admin';
export const PROJECT_ADMIN = 'admin';
export const PROJECT_USER = 'user';
export const PROJECT_VIEWER = 'viewer';

const instanceRoles = [INSTANCE_ADMIN];
const projectRoles = [PROJECT_ADMIN, PROJECT_USER, PROJECT_VIEWER];

const UserRolesSchema = new Schema({
  userId: String,
  instanceRoles: [{
    role: { type: String, enum: instanceRoles },
  }],
  projectRoles: [{
    project: String,
    role: { type: String, enum: projectRoles },
  }],
});

mongoose.model('UserRoles', UserRolesSchema, 'userRoles');
