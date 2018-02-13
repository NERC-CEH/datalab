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

function handleRoles(roles) {
  const projects = roles
    .map(parseRoles)
    .map(parseProjects)
    .filter(role => role.projectName)
    .map(buildProjectRoles);

  logger.debug(JSON.stringify(projects, null, 2));

  return [...projects];
}

export default handleRoles;
