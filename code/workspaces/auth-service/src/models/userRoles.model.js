import mongoose from 'mongoose';

const { Schema } = mongoose;

export const PROJECT_ADMIN = 'admin';
export const PROJECT_USER = 'user';
export const PROJECT_VIEWER = 'viewer';

export const PROJECT_ROLES = [PROJECT_ADMIN, PROJECT_USER, PROJECT_VIEWER];

const UserRolesSchema = new Schema({
  userId: String,
  instanceAdmin: { type: Boolean, default: false },
  projectRoles: [{
    projectKey: String,
    role: { type: String, enum: PROJECT_ROLES },
  }],
});

mongoose.model('UserRoles', UserRolesSchema, 'userRoles');
