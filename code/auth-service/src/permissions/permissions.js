import fs from 'fs';
import logger from 'winston';
import yaml from 'js-yaml';
import config from '../config/config';

const roleDelim = ':';
const projectTag = 'project';

const permissionBuffer = fs.readFileSync(config.get('permissionAttributes'));
const roleBuffer = fs.readFileSync(config.get('roleAttributes'));
const permissionAttributes = yaml.safeLoad(permissionBuffer);
const roleAttributes = yaml.safeLoad(roleBuffer);

const parseRoles = role => role.split(roleDelim, 2);

const parseProjects = ([head, tail]) => ({
  projectName: tail ? head : undefined,
  role: tail || head,
});

const buildProjectRoles = ({ projectName, role }) => ({
  projectName,
  projectRoles: roleAttributes[`${projectTag}${roleDelim}${role}`]
    .map(getPermissions),
});

const getPermissions = subRole => ({
  ...subRole,
  permissions: permissionAttributes[subRole.role],
});

const buildPermissions = ({ projectName, projectRoles }) =>
  projectRoles.reduce((previous, { name: processName, permissions }) =>
    permissions.map(action => `${projectName}${roleDelim}${processName}${roleDelim}${action}`),
    []);

const flattenArray = (previous, current) => {
  if (Array.isArray(current)) {
    return [...previous, ...current];
  }
  return previous;
};

function handleRoles(roles) {
  const projects = roles
    .map(parseRoles)
    .map(parseProjects)
    .filter(role => role.projectName)
    .map(buildProjectRoles)
    .map(buildPermissions)
    .reduce(flattenArray, []);

  logger.debug(JSON.stringify(projects, null, 2));

  return [...projects];
}

export default handleRoles;
