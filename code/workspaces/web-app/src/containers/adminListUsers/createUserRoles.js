import { ANALYSIS, PUBLISH } from 'common/src/stackTypes';
import { permissionTypes } from 'common';

const { INSTANCE_ADMIN_ROLE_KEY, CATALOGUE_ROLE_KEY, CATALOGUE_ADMIN_ROLE, CATALOGUE_PUBLISHER_ROLE, CATALOGUE_EDITOR_ROLE,
  PROJECT_ADMIN_ROLE, PROJECT_USER_ROLE, PROJECT_VIEWER_ROLE } = permissionTypes;

function filterMapProjectRoleToProjectKeys(projectRoles, role) {
  if (projectRoles === undefined) {
    return [];
  }
  return projectRoles
    .filter(projectRole => projectRole.role === role)
    .map(projectRole => projectRole.projectKey);
}

function filterMapStacksToUserOwnedStacks(stacks, userId, category) {
  return stacks
    .filter(stack => stack.category === category
         && stack.users.includes(userId))
    .map(stack => ({ projectKey: stack.projectKey, name: stack.name }));
}

function filterMapStorageToUserAccessedStorage(storage, userId) {
  return storage
    .filter(dataStore => dataStore.users.includes(userId))
    .map(dataStore => ({ projectKey: dataStore.projectKey, name: dataStore.name }));
}

function createUserRoles(usersProjectRoles, stacksArray, dataStorageArray) {
  if (usersProjectRoles.fetching || stacksArray.fetching || dataStorageArray.fetching) {
    return {};
  }

  const userRoles = {};
  usersProjectRoles.value.forEach((userProjectRoles) => {
    userRoles[userProjectRoles.userId] = {
      instanceAdmin: userProjectRoles[INSTANCE_ADMIN_ROLE_KEY],
      catalogueRole: userProjectRoles[CATALOGUE_ROLE_KEY],
      catalogueAdmin: userProjectRoles[CATALOGUE_ROLE_KEY] === CATALOGUE_ADMIN_ROLE,
      cataloguePublisher: userProjectRoles[CATALOGUE_ROLE_KEY] === CATALOGUE_PUBLISHER_ROLE,
      catalogueEditor: userProjectRoles[CATALOGUE_ROLE_KEY] === CATALOGUE_EDITOR_ROLE,
      projectAdmin: filterMapProjectRoleToProjectKeys(userProjectRoles.projectRoles, PROJECT_ADMIN_ROLE),
      projectUser: filterMapProjectRoleToProjectKeys(userProjectRoles.projectRoles, PROJECT_USER_ROLE),
      projectViewer: filterMapProjectRoleToProjectKeys(userProjectRoles.projectRoles, PROJECT_VIEWER_ROLE),
      siteOwner: filterMapStacksToUserOwnedStacks(stacksArray.value, userProjectRoles.userId, PUBLISH),
      notebookOwner: filterMapStacksToUserOwnedStacks(stacksArray.value, userProjectRoles.userId, ANALYSIS),
      storageAccess: filterMapStorageToUserAccessedStorage(dataStorageArray.value, userProjectRoles.userId),
    };
  });

  return userRoles;
}

export default createUserRoles;
