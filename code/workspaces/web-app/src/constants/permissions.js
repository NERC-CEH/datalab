// Array must be ordered from highest permission level to lowest
const orderedPermissions = [
  'admin',
  'user',
  'viewer',
];

export const PERMISSIONS = createPermissions(orderedPermissions);
export const PERMISSION_VALUES = createValuedPermissions(orderedPermissions);
export const SORTED_PERMISSIONS = createSortedPermissions(orderedPermissions);

function createPermissions(permissions) {
  const result = {};
  permissions.forEach((item) => {
    result[item.toUpperCase()] = item;
  });
  return result;
}

function createValuedPermissions(permissions) {
  const result = {};
  [...permissions].reverse().forEach((item, index) => {
    result[item.toUpperCase()] = index;
  });
  return result;
}

function createSortedPermissions(permissions) {
  return [...permissions]
    .reverse()
    .map((item, index) => ({ name: item, value: index }))
    .reverse();
}
