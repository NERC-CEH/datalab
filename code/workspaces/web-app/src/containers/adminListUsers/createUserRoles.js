import { ANALYSIS, PUBLISH } from 'common/src/stackTypes';

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
      instanceAdmin: userProjectRoles.instanceAdmin,
      projectAdmin: filterMapProjectRoleToProjectKeys(userProjectRoles.projectRoles, 'admin'),
      projectUser: filterMapProjectRoleToProjectKeys(userProjectRoles.projectRoles, 'user'),
      projectViewer: filterMapProjectRoleToProjectKeys(userProjectRoles.projectRoles, 'viewer'),
      siteOwner: filterMapStacksToUserOwnedStacks(stacksArray.value, userProjectRoles.userId, PUBLISH),
      notebookOwner: filterMapStacksToUserOwnedStacks(stacksArray.value, userProjectRoles.userId, ANALYSIS),
      storageAccess: filterMapStorageToUserAccessedStorage(dataStorageArray.value, userProjectRoles.userId),
    };
  });

  return userRoles;
}

export default createUserRoles;
