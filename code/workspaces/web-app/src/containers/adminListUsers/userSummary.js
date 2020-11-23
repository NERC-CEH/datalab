import allFiltersOff from './allFiltersOff';

function summaryString(name, num) {
  const plural = num !== 1 ? 's' : '';
  return `${num} ${name}${plural}`;
}

function projectSummary(filters, roles) {
  const filtersOff = allFiltersOff(filters);
  if (!filtersOff && !filters.projectAdmin && !filters.projectUser && !filters.projectViewer) {
    return [];
  }

  const projectAdminKeys = (filtersOff || filters.projectAdmin) ? roles.projectAdmin : [];
  const projectUserKeys = (filtersOff || filters.projectUser) ? roles.projectUser : [];
  const projectViewerKeys = (filtersOff || filters.projectViewer) ? roles.projectViewer : [];

  const projectKeys = [...projectViewerKeys, ...projectUserKeys, ...projectAdminKeys];
  const uniqueProjectKeys = [...new Set(projectKeys)].sort();
  const numProjects = uniqueProjectKeys.length;
  return [summaryString('project', numProjects)];
}

function siteSummary(filters, roles) {
  const filtersOff = allFiltersOff(filters);
  if (filtersOff || filters.siteOwner) {
    const numSites = roles.siteOwner.length;
    return [summaryString('site', numSites)];
  }
  return [];
}

function notebookSummary(filters, roles) {
  const filtersOff = allFiltersOff(filters);
  if (filtersOff || filters.notebookOwner) {
    const numNotebooks = roles.notebookOwner.length;
    return [summaryString('notebook', numNotebooks)];
  }
  return [];
}

function storageSummary(filters, roles) {
  const filtersOff = allFiltersOff(filters);
  if (filtersOff || filters.storageAccess) {
    const numDataStores = roles.storageAccess.length;
    return [summaryString('data store', numDataStores)];
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
