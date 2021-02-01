import mongoose from 'mongoose';
import { permissionTypes } from 'common';
import { CATALOGUE_ROLE_KEY, INSTANCE_ADMIN_ROLE_KEY, DATA_MANAGER_ROLE_KEY } from 'common/src/permissionTypes';

const { Schema } = mongoose;
const { CATALOGUE_ROLES, PROJECT_ROLES } = permissionTypes;

const UserRolesSchema = new Schema({
  userId: String,
  userName: String,
  [INSTANCE_ADMIN_ROLE_KEY]: { type: Boolean, default: false },
  [DATA_MANAGER_ROLE_KEY]: { type: Boolean, default: false },
  [CATALOGUE_ROLE_KEY]: { type: String, enum: CATALOGUE_ROLES },
  projectRoles: [{
    projectKey: String,
    role: { type: String, enum: PROJECT_ROLES },
  }],
});

mongoose.model('UserRoles', UserRolesSchema, 'userRoles');
