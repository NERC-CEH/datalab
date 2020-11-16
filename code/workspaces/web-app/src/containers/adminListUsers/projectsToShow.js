import allFiltersOff from './allFiltersOff';

export default function projectsToShow(filters, roles) {
  const filtersOff = allFiltersOff(filters);

  const projectViewerKeys = (filtersOff || filters.projectViewer) ? [...roles.projectViewer] : [];
  const projectUserKeys = (filtersOff || filters.projectUser) ? [...roles.projectUser] : [];
  const projectAdminKeys = (filtersOff || filters.projectAdmin) ? [...roles.projectAdmin] : [];
  const siteKeys = (filtersOff || filters.siteOwner) ? roles.siteOwner.map(resource => resource.projectKey) : [];
  const notebookKeys = (filtersOff || filters.notebookOwner) ? roles.notebookOwner.map(resource => resource.projectKey) : [];
  const storageKeys = (filtersOff || filters.storageAccess) ? roles.storageAccess.map(resource => resource.projectKey) : [];

  const projectKeys = [...projectViewerKeys, ...projectUserKeys, ...projectAdminKeys, ...siteKeys, ...notebookKeys, ...storageKeys];
  const uniqueProjectKeys = [...new Set(projectKeys)].sort();
  return uniqueProjectKeys;
}
