import { permissionTypes } from 'common';
import fs from 'fs';
import yaml from 'js-yaml';
import config from '../config/config';

const { CATALOGUE_ROLE_KEY, INSTANCE_ADMIN_ROLE, SYSTEM, PROJECT_NAMESPACE } = permissionTypes;

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

//    [ { role: 'admin', projectKey: 'project2', permissions: [/see permissions.yml/] } ]
// -> [ ['projects:project2:stacks:delete', ...] ]
const projectifyPermissions = ({ projectKey, permissions }) => {
  const prefix = projectKey ? `${PROJECT_NAMESPACE}${roleDelim}${projectKey}${roleDelim}` : '';
  return permissions.map(permission => prefix.concat(permission));
};

//    [ { role: 'instanceAdmin', permissions: [/see permissions.yml/] } ]
// -> [ ['system:instance:admin', ...] ]
const systemifyPermissions = ({ permissions }) => {
  const prefix = `${SYSTEM}${roleDelim}`;
  return permissions.map(permission => prefix.concat(permission));
};

const flattenArray = (previous, current) => {
  if (Array.isArray(current)) {
    return [...previous, ...current];
  }
  return previous;
};

function getCataloguePermissions(catalogueRole) {
  if (!catalogueRole) {
    return [];
  }
  const permissions = permissionAttributes[CATALOGUE_ROLE_KEY]
    .filter(role => role.role === catalogueRole)
    .map(role => role.permissions)
    .map(permission => `system:catalogue:${permission}`);
  return permissions;
}

const processRoles = (userRoles) => {
  const projectRoles = userRoles.projectRoles || [];
  const projectPermissions = projectRoles
    .map(getPermissions)
    .map(buildPermissions)
    .map(projectifyPermissions)
    .reduce(flattenArray, []);

  const systemRoles = userRoles[INSTANCE_ADMIN_ROLE] ? [{ role: INSTANCE_ADMIN_ROLE }] : [];
  const systemPermissions = systemRoles
    .map(getPermissions)
    .map(buildPermissions)
    .map(systemifyPermissions)
    .reduce(flattenArray, []);

  const catalogueRole = userRoles[CATALOGUE_ROLE_KEY];
  const cataloguePermissions = getCataloguePermissions(catalogueRole);

  return [...projectPermissions, ...systemPermissions, ...cataloguePermissions];
};

export default processRoles;
