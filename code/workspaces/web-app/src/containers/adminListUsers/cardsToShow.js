function filterByProjectKeyAndMapToName(resources, projectKey) {
  return resources
    .filter(resource => resource.projectKey === projectKey)
    .map(resource => resource.name);
}

function dataStorageCardsToShow(roles, projectKey) {
  return filterByProjectKeyAndMapToName(roles.storageAccess, projectKey);
}

function notebookCardsToShow(roles, projectKey) {
  return filterByProjectKeyAndMapToName(roles.notebookOwner, projectKey);
}

function siteCardsToShow(roles, projectKey) {
  return filterByProjectKeyAndMapToName(roles.siteOwner, projectKey);
}

function projectCardsToShow(roles, projectKey) {
  return (roles.projectViewer.includes(projectKey)
    || roles.projectUser.includes(projectKey)
    || roles.projectAdmin.includes(projectKey)
  ) ? [projectKey] : [];
}

const cardsToShow = { dataStorageCardsToShow, notebookCardsToShow, projectCardsToShow, siteCardsToShow };
export default cardsToShow;
