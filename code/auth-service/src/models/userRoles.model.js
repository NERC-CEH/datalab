import mongoose from 'mongoose';

const { Schema } = mongoose;

export const PROJECT_ADMIN = 'admin';
export const PROJECT_USER = 'user';
export const PROJECT_VIEWER = 'viewer';

const projectRoles = [PROJECT_ADMIN, PROJECT_USER, PROJECT_VIEWER];

const UserRolesSchema = new Schema({
  userId: String,
  instanceAdmin: Boolean,
  projectRoles: [{
    projectName: String,
    role: { type: String, enum: projectRoles },
  }],
});

mongoose.model('UserRoles', UserRolesSchema, 'userRoles');
