const READ = 'read';
const CREATE = 'create';
const DELETE = 'delete';
const LIST = 'list';
const OPEN = 'open';
const EDIT = 'edit';
const ADMIN = 'admin';

const STACKS = 'stacks';
const STORAGE = 'storage';
const SETTINGS = 'settings';
const PERMISSIONS = 'permissions';
const USERS = 'users';
const INSTANCE = 'instance';
const PROJECTS = 'projects';

const PROJECT_NAMESPACE = 'projects';
const KEY_TOKEN = '?projectKey?';
const SYSTEM = 'system';

// key name used for admin role boolean in auth
const INSTANCE_ADMIN_ROLE = 'instanceAdmin';

const keyDelim = '_';
const permissionDelim = ':';

const elementsPermissionList = {
  READ,
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
  SETTINGS,
  PERMISSIONS,
  PROJECTS,
};

const PROJECT_KEY = `${PROJECT_NAMESPACE}${permissionDelim}${KEY_TOKEN}`;
const projectKeys = {
  PROJECT_KEY,
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

const projectPermissions = flatMapPermissions(projectKeys, { ...elementPermissions, ...usersPermissions });

const projectKeyPermission = (permission, projectKey) => permission.replace(KEY_TOKEN, projectKey);

const systemPermissions = flatMapPermissions({ SYSTEM }, flatMapPermissions({ INSTANCE }, { ADMIN }));

const { SYSTEM_INSTANCE_ADMIN } = systemPermissions;

export {
  INSTANCE_ADMIN_ROLE,
  SYSTEM_INSTANCE_ADMIN,
  PROJECT_NAMESPACE,
  SYSTEM,
  elementPermissions,
  usersPermissions,
  projectPermissions,
  systemPermissions,
  permissionDelim as delimiter,
  projectKeyPermission,
};
