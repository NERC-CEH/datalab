import fs from 'fs';
import yaml from 'js-yaml';
import config from '../config/config';

const roleDelim = ':';
const projectTag = 'project';

const permissionAttributes = yaml.safeLoad(fs.readFileSync(config.get('permissionAttributes')));

const parseRoles = role => role.split(roleDelim, 2);

const concatRoles = (head, tail) =>
  `${head}${roleDelim}${tail}`;

const parseProjects = ([head, tail]) => ({
  projectName: tail ? head : undefined,
  role: tail ? concatRoles(projectTag, tail) : head,
});

const getPermissions = roleObject => ({
  ...roleObject,
  permissions: buildPermissions(permissionAttributes[roleObject.role]),
});

const flattenArray = (previous, current) => {
  if (Array.isArray(current)) {
    return [...previous, ...current];
  }
  return previous;
};

const buildPermissions = element =>
  element.map(({ name, permissions }) =>
    permissions.map(permission => concatRoles(name, permission)))
    .reduce(flattenArray, []);

const projectifyPermissions = ({ projectName, permissions }) => {
  if (projectName) {
    return permissions.map(permission => concatRoles(projectName, permission));
  }

  return permissions;
};

const processRoles = roles =>
  roles.map(parseRoles)
    .map(parseProjects)
    .map(getPermissions)
    .map(projectifyPermissions)
    .reduce(flattenArray, []);

export default processRoles;
