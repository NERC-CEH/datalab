function dataStorageCardsToShow(roles, projectKey) {
  const dataStoreNames = roles.storageAccess
    .filter(resource => resource.projectKey === projectKey)
    .map(resource => resource.name);

  return dataStoreNames;
}

function notebookCardsToShow(roles, projectKey) {
  const notebookNames = roles.notebookOwner
    .filter(resource => resource.projectKey === projectKey)
    .map(resource => resource.name);

  return notebookNames;
}

function projectCardsToShow(roles, projectKey) {
  return roles.projectViewer.includes(projectKey) ? [projectKey] : [];
}

function siteCardsToShow(roles, projectKey) {
  const siteNames = roles.siteOwner
    .filter(resource => resource.projectKey === projectKey)
    .map(resource => resource.name);

  return siteNames;
}

export default { dataStorageCardsToShow, notebookCardsToShow, projectCardsToShow, siteCardsToShow };
