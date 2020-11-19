import projectsToShow from './projectsToShow';

const projectAdminKey = 'proj-admin';
const projectUserKey = 'proj-user';
const projectViewerKey = 'proj-viewer';
const projectSharedKey = 'proj-shared';
const siteProjectKey = 'proj-site';
const notebookProjectKey = 'proj-notebook';
const storageProjectKey = 'proj-storage';
const name = 'name';

const roles = {
  instanceAdmin: true,
  projectAdmin: [projectAdminKey],
  projectUser: [projectAdminKey, projectUserKey],
  projectViewer: [projectAdminKey, projectUserKey, projectViewerKey],
  siteOwner: [{ projectKey: projectSharedKey, name }, { projectKey: siteProjectKey, name }],
  notebookOwner: [{ projectKey: projectSharedKey, name }, { projectKey: notebookProjectKey, name }],
  storageAccess: [{ projectKey: projectSharedKey, name }, { projectKey: storageProjectKey, name }],
};

describe('projectsToShow', () => {
  it('shows all projects if filters off', () => {
    // Arrange
    const filters = { filter1: false };

    // Act/Assert
    expect(projectsToShow(filters, roles)).toEqual([projectAdminKey, projectUserKey, projectViewerKey, projectSharedKey, siteProjectKey, notebookProjectKey, storageProjectKey].sort());
  });

  it('match projects admin for', () => {
    // Arrange
    const filters = { projectAdmin: true };

    // Act/Assert
    expect(projectsToShow(filters, roles)).toEqual([projectAdminKey]);
  });

  it('match projects user for', () => {
    // Arrange
    const filters = { projectUser: true };

    // Act/Assert
    expect(projectsToShow(filters, roles)).toEqual([projectAdminKey, projectUserKey].sort());
  });

  it('match projects viewer for', () => {
    // Arrange
    const filters = { projectViewer: true };

    // Act/Assert
    expect(projectsToShow(filters, roles)).toEqual([projectAdminKey, projectUserKey, projectViewerKey].sort());
  });

  it('match projects site owner for', () => {
    // Arrange
    const filters = { siteOwner: true };

    // Act/Assert
    expect(projectsToShow(filters, roles)).toEqual([projectSharedKey, siteProjectKey].sort());
  });

  it('match projects notebook owner for', () => {
    // Arrange
    const filters = { notebookOwner: true };

    // Act/Assert
    expect(projectsToShow(filters, roles)).toEqual([projectSharedKey, notebookProjectKey].sort());
  });

  it('match projects with storage access', () => {
    // Arrange
    const filters = { storageAccess: true };

    // Act/Assert
    expect(projectsToShow(filters, roles)).toEqual([projectSharedKey, storageProjectKey].sort());
  });
});
