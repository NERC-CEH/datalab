import fs from 'fs';
import yaml from 'js-yaml';
import config from '../config/config';

const roleDelim = ':';

const permissionAttributes = yaml.safeLoad(fs.readFileSync(config.get('permissionAttributes')));

//    [ { role: 'admin', projectName: 'project' } ]
// -> [ { role: 'admin', projectName: 'project', permissions: [stackAttributes, storageAttributes, userAttributes] } ]
const getPermissions = roleObject => ({
  ...roleObject,
  permissions: permissionAttributes[roleObject.role] || [],
});

//    [ { role: 'admin', projectName: 'project', permissions: [stackAttributes, storageAttributes, userAttributes] } ]
// -> [ { role: 'admin', projectName: 'project', permissions: [/see permissions.yml/] } ]
const buildPermissions = ({ permissions, ...rest }) => ({
  ...rest,
  permissions: permissions.map(({ name, permissions: subPermissions }) => subPermissions.map(permission => name.concat(roleDelim, permission)))
    .reduce(flattenArray, []),
});

//    [ { role: 'admin', projectName: 'project', permissions: [/see permissions.yml/] } ]
// -> [ ['project:stacks:delete', ...] ]
const projectifyPermissions = ({ projectName, permissions }) => {
  const project = projectName ? `${projectName}${roleDelim}` : '';

  return permissions.map(permission => project.concat(permission));
};

const flattenArray = (previous, current) => {
  if (Array.isArray(current)) {
    return [...previous, ...current];
  }
  return previous;
};

const processRoles = userRoles => userRoles.projectRoles
  .map(getPermissions)
  .map(buildPermissions)
  .map(projectifyPermissions)
  .reduce(flattenArray, []);

export default processRoles;
