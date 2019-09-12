import { permissionTypes } from 'common';
import fs from 'fs';
import yaml from 'js-yaml';
import config from '../config/config';

const { INSTANCE_ADMIN_ROLE, SYSTEM } = permissionTypes;

const roleDelim = ':';

const permissionAttributes = yaml.safeLoad(fs.readFileSync(config.get('permissionAttributes')));

//    [ { role: 'admin', projectKey: 'project' } ]
// -> [ { role: 'admin', projectKey: 'project', permissions: [stackAttributes, storageAttributes, userAttributes] } ]
const getPermissions = roleObject => ({
  ...roleObject,
  permissions: permissionAttributes[roleObject.role] || [],
});

//    [ { role: 'admin', projectKey: 'project', permissions: [stackAttributes, storageAttributes, userAttributes] } ]
// -> [ { role: 'admin', projectKey: 'project', permissions: [/see permissions.yml/] } ]
const buildPermissions = ({ permissions, ...rest }) => ({
  ...rest,
  permissions: permissions.map(({ name, permissions: subPermissions }) => subPermissions.map(permission => name.concat(roleDelim, permission)))
    .reduce(flattenArray, []),
});

//    [ { role: 'admin', projectKey: 'project', permissions: [/see permissions.yml/] } ]
// -> [ ['project:stacks:delete', ...] ]
const projectifyPermissions = ({ projectKey, permissions }) => {
  const project = projectKey ? `${projectKey}${roleDelim}` : '';

  return permissions.map(permission => project.concat(permission));
};

const flattenArray = (previous, current) => {
  if (Array.isArray(current)) {
    return [...previous, ...current];
  }
  return previous;
};

const processRoles = ({ projectRoles, [INSTANCE_ADMIN_ROLE]: instanceAdmin }) => [
  ...projectRoles || [],
  ...(instanceAdmin && [{ projectKey: SYSTEM, role: INSTANCE_ADMIN_ROLE }]) || [],
]
  .map(getPermissions)
  .map(buildPermissions)
  .map(projectifyPermissions)
  .reduce(flattenArray, []);

export default processRoles;
