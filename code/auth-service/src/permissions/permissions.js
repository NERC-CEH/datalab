import fs from 'fs';
import yaml from 'js-yaml';
import config from '../config/config';

const roleDelim = ':';

const permissionAttributes = yaml.safeLoad(fs.readFileSync(config.get('permissionAttributes')));

//    [ { role: 'instance-admin' }, { role: 'legacy-project:admin' } ]
// -> [ 'instance-admin', 'project:admin' ]
const extractInstanceRoles = entry => entry.role.replace('legacy-project', 'project');

//    [ 'instance-admin', 'project:admin' ]
// -> [ ['instance-admin'], ['project','admin'] ]
const parseRoles = role => role.split(roleDelim, 2);

//    [ ['instance-admin'], ['project','admin'] ]
// -> [ { role: 'instance-admin', projectName: undefined }, { role: 'admin', projectName: 'project' } ]
const parseProjects = splitRoles => ({
  role: splitRoles.pop(),
  projectName: splitRoles.pop(),
});

//    [ { role: 'instance-admin', projectName: undefined }, { role: 'admin', projectName: 'project' } ]
// -> [ { role: 'instance-admin', projectName: undefined, permissions: [] },
//      { role: 'admin', projectName: 'project', permissions: [stackAttributes, storageAttributes, userAttributes] } ]
const getPermissions = roleObject => ({
  ...roleObject,
  permissions: permissionAttributes[roleObject.role] || [],
});

//    [ { role: 'instance-admin', projectName: undefined, permissions: [] },
//      { role: 'admin', projectName: 'project', permissions: [stackAttributes, storageAttributes, userAttributes] } ]
// -> [ { role: 'instance-admin', projectName: undefined, permissions: [] },
//      { role: 'admin', projectName: 'project', permissions: [/see permissions.yml/] } ]
const buildPermissions = ({ permissions, ...rest }) => ({
  ...rest,
  permissions: permissions.map(({ name, permissions: subPermissions }) => subPermissions.map(permission => name.concat(roleDelim, permission)))
    .reduce(flattenArray, []),
});

//    [ { role: 'instance-admin', projectName: undefined, permissions: [] },
//      { role: 'admin', projectName: 'project', permissions: [/see permissions.yml/] } ]
// -> [ [],
//      ['project:stacks:delete', ...] ]
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

function processRoles(roles) {
  const legacyProjectRoles = roles.instanceRoles
    .map(extractInstanceRoles)
    .map(parseRoles)
    .map(parseProjects);

  const projectRoles = legacyProjectRoles.concat(roles.projectRoles);

  const projectPermissions = projectRoles
    .map(getPermissions)
    .map(buildPermissions)
    .map(projectifyPermissions);

  return projectPermissions.reduce(flattenArray, []);
}

export default processRoles;
