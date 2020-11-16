import allFiltersOff from './allFiltersOff';

const plural = num => (num !== 1 ? 's' : '');

function projectSummary(filters, roles) {
  const filtersOff = allFiltersOff(filters);
  if (filtersOff || filters.projectViewer) {
    const numProjects = roles.projectViewer.length;
    return [`${numProjects} project${plural(numProjects)}`];
  } if (filters.projectUser) {
    const numProjects = roles.projectUser.length;
    return [`${numProjects} project${plural(numProjects)}`];
  } if (filters.projectAdmin) {
    const numProjects = roles.projectAdmin.length;
    return [`${numProjects} project${plural(numProjects)}`];
  }
  return [];
}

function siteSummary(filters, roles) {
  const filtersOff = allFiltersOff(filters);
  if (filtersOff || filters.siteOwner) {
    const numSites = roles.siteOwner.length;
    return [`${numSites} site${plural(numSites)}`];
  }
  return [];
}

function notebookSummary(filters, roles) {
  const filtersOff = allFiltersOff(filters);
  if (filtersOff || filters.notebookOwner) {
    const numNotebooks = roles.notebookOwner.length;
    return [`${numNotebooks} notebook${plural(numNotebooks)}`];
  }
  return [];
}

function storageSummary(filters, roles) {
  const filtersOff = allFiltersOff(filters);
  if (filtersOff || filters.storageAccess) {
    const numDataStores = roles.storageAccess.length;
    return [`${numDataStores} data store${plural(numDataStores)}`];
  }
  return [];
}

export default function userSummary(filters, roles) {
  const projectInfo = projectSummary(filters, roles);
  const siteInfo = siteSummary(filters, roles);
  const notebookInfo = notebookSummary(filters, roles);
  const storageInfo = storageSummary(filters, roles);

  const info = [...projectInfo, ...siteInfo, ...notebookInfo, ...storageInfo];
  return info.join(', ');
}
