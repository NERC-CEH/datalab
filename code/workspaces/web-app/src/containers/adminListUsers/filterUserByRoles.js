import allFiltersOff from './allFiltersOff';

function filterUserByRoles(userId, filters, otherUserRoles) {
  // if all the filters are off, user is shown
  if (allFiltersOff(filters)) { return true; }

  // if user does not appear in user roles, user is not shown
  const roles = otherUserRoles[userId];
  if (!roles) { return false; }

  // see if we match a filter
  if (filters.instanceAdmin && roles.instanceAdmin) { return true; }
  if (filters.dataManager && roles.dataManager) { return true; }
  if (filters.catalogueAdmin && roles.catalogueAdmin) { return true; }
  if (filters.cataloguePublisher && roles.cataloguePublisher) { return true; }
  if (filters.catalogueEditor && roles.catalogueEditor) { return true; }
  if (filters.projectAdmin && roles.projectAdmin.length > 0) { return true; }
  if (filters.projectUser && roles.projectUser.length > 0) { return true; }
  if (filters.projectViewer && roles.projectViewer.length > 0) { return true; }
  if (filters.siteOwner && roles.siteOwner.length > 0) { return true; }
  if (filters.notebookOwner && roles.notebookOwner.length > 0) { return true; }
  if (filters.storageAccess && roles.storageAccess.length > 0) { return true; }

  // user did not match any filter
  return false;
}

export default filterUserByRoles;
