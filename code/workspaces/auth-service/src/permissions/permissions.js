import { permissionTypes } from 'common';
import fs from 'fs';
import yaml from 'js-yaml';
import config from '../config/config';

const { PROJECT_ROLES_KEY, CATALOGUE_ROLE_KEY, INSTANCE_ADMIN_ROLE_KEY, SYSTEM, INSTANCE, CATALOGUE, PROJECT_NAMESPACE } = permissionTypes;

const roleDelim = ':';

const permissionAttributes = yaml.safeLoad(fs.readFileSync(config.get('permissionAttributes')));

//    [ { role: 'admin', projectKey: 'project' } ]
// -> [ { role: 'admin', projectKey: 'project', permissions: [stackAttributes, storageAttributes, userAttributes] } ]
const getPermissions = roleObject => ({
  ...roleObject,
  permissions: permissionAttributes[PROJECT_ROLES_KEY][roleObject.role] || [],
});

//    [ { role: 'admin', projectKey: 'project', permissions: [stackAttributes, storageAttributes, userAttributes] } ]
// -> [ { role: 'admin', projectKey: 'project', permissions: [/see permissions.yml/] } ]
const buildPermissions = ({ permissions, ...rest }) => ({
  ...rest,
  permissions: permissions.map(({ name, permissions: subPermissions }) => subPermissions.map(permission => name.concat(roleDelim, permission)))
    .reduce(flattenArray, []),
});

//    [ 'system', 'instance', 'admin' ]
// -> 'system:instance:admin'
const stringifyPermissions = permissions => permissions.join(roleDelim);

//    [ { role: 'admin', projectKey: 'project2', permissions: [/see permissions.yml/] } ]
// -> [ ['projects:project2:stacks:delete', ...] ]
const projectifyPermissions = ({ projectKey, permissions }) => permissions
  .map(permission => stringifyPermissions([PROJECT_NAMESPACE, projectKey, permission]));

const flattenArray = (previous, current) => {
  if (Array.isArray(current)) {
    return [...previous, ...current];
  }
  return previous;
};

function getInstanceAdminPermissions(instanceRole) {
  if (!instanceRole) {
    return [];
  }
  const { permissions } = permissionAttributes[INSTANCE_ADMIN_ROLE_KEY];
  return permissions
    .map(permission => stringifyPermissions([SYSTEM, INSTANCE, permission]));
}

function getCataloguePermissions(catalogueRole) {
  if (!catalogueRole) {
    return [];
  }
  const permissions = permissionAttributes[CATALOGUE_ROLE_KEY]
    .filter(role => role.role === catalogueRole)
    .flatMap(role => role.permissions)
    .map(permission => stringifyPermissions([SYSTEM, CATALOGUE, permission]));
  return permissions;
}

const processRoles = (userRoles) => {
  const projectRoles = userRoles[PROJECT_ROLES_KEY] || [];
  const projectPermissions = projectRoles
    .map(getPermissions)
    .map(buildPermissions)
    .map(projectifyPermissions)
    .reduce(flattenArray, []);

  const instanceAdminRole = userRoles[INSTANCE_ADMIN_ROLE_KEY];
  const instanceAdminPermissions = getInstanceAdminPermissions(instanceAdminRole);

  const catalogueRole = userRoles[CATALOGUE_ROLE_KEY];
  const cataloguePermissions = getCataloguePermissions(catalogueRole);

  return [...projectPermissions, ...instanceAdminPermissions, ...cataloguePermissions];
};

export default processRoles;
