const CREATE = 'create';
const DELETE = 'delete';
const LIST = 'list';
const OPEN = 'open';
const EDIT = 'edit';

const STACKS = 'stacks';
const STORAGE = 'storage';
const USERS = 'users';

const PROJECT = 'project';

const keyDelim = '_';
const permissionDelim = ':';

const elementsPermissionList = {
  CREATE,
  DELETE,
  LIST,
  OPEN,
  EDIT,
};

const usersPermissionList = {
  LIST,
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

const elementPermissions = flatMapPermissions(elements, elementsPermissionList);

const usersPermissions = flatMapPermissions({ USERS }, usersPermissionList);

const projectPermissions = flatMapPermissions(projects, { ...elementPermissions, ...usersPermissions });

export {
  PROJECT,
  elementPermissions,
  usersPermissions,
  projectPermissions,
  permissionDelim as delimiter,
};
