import mongoose from 'mongoose';
import { permissionTypes } from 'common';

const { Schema } = mongoose;
const { CATALOGUE_ROLES, PROJECT_ROLES } = permissionTypes;

const UserRolesSchema = new Schema({
  userId: String,
  userName: String,
  instanceAdmin: { type: Boolean, default: false },
  catalogueRoles: { type: String, enum: CATALOGUE_ROLES },
  projectRoles: [{
    projectKey: String,
    role: { type: String, enum: PROJECT_ROLES },
  }],
});

mongoose.model('UserRoles', UserRolesSchema, 'userRoles');
