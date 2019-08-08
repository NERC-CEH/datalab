import fs from 'fs';
import yaml from 'js-yaml';
import config from '../config/config';

const roleDelim = ':';

const permissionAttributes = yaml.safeLoad(fs.readFileSync(config.get('permissionAttributes')));

const parseRoles = role => role.split(roleDelim, 2);

const parseProjects = splitRoles => ({
  role: splitRoles.pop(),
  projectName: splitRoles.pop(),
});

const getPermissions = roleObject => ({
  ...roleObject,
  permissions: permissionAttributes[roleObject.role] || [],
});

const flattenArray = (previous, current) => {
  if (Array.isArray(current)) {
    return [...previous, ...current];
  }
  return previous;
};

const buildPermissions = ({ permissions, ...rest }) => ({
  ...rest,
  permissions: permissions.map(({ name, permissions: subPermissions }) => subPermissions.map(permission => name.concat(roleDelim, permission)))
    .reduce(flattenArray, []),
});

const projectifyPermissions = ({ projectName, permissions }) => {
  const project = projectName ? `${projectName}${roleDelim}` : '';

  return permissions.map(permission => project.concat(permission));
};

const processRoles = roles => roles.map(parseRoles)
  .map(parseProjects)
  .map(getPermissions)
  .map(buildPermissions)
  .map(projectifyPermissions)
  .reduce(flattenArray, []);

export default processRoles;
