const CREATE = 'create';
const DELETE = 'delete';
const LIST = 'list';
const OPEN = 'open';
const GRANT = 'grant';
const FORBID = 'forbid';

const STACKS = 'stacks';
const STORAGE = 'storage';
const USERS = 'users';

export const PROJECT = 'project';

const keyDelim = '_';
export const permissionDelim = ':';

const elementsPermissionList = {
  CREATE,
  DELETE,
  LIST,
  OPEN,
};

const usersPermissionList = {
  LIST,
  GRANT,
  FORBID,
};

const elements = {
  STACKS,
  STORAGE,
};

const projects = {
  PROJECT,
};

const concatPermissions = (head, tail, char) => `${head}${char}${tail}`;

const makePermissionObj = ([outerKey, outerValue], [innerKey, innerValue]) => ({
  [concatPermissions(outerKey, innerKey, keyDelim)]: concatPermissions(outerValue, innerValue, permissionDelim),
});

const flatMapPermissions = (outer, inner) => Object.entries(outer)
  .map(outerPairs => Object.entries(inner)
    .map(innerPairs => makePermissionObj(outerPairs, innerPairs)))
  .reduce((previous, current) => [...previous, ...current], [])
  .reduce((previous, current) => Object.assign(previous, current), {});

export const elementPermissions = flatMapPermissions(elements, elementsPermissionList);

export const usersPermissions = flatMapPermissions({ USERS }, usersPermissionList);

export const projectPermissions = flatMapPermissions(projects, { ...elementPermissions, ...usersPermissions });

export default {
  ...elementPermissions,
  ...usersPermissions,
  ...projectPermissions,
};
