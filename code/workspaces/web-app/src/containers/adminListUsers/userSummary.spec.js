import userSummary from './userSummary';

const projectAdminKey = 'proj-admin';
const projectUserKey = 'proj-user';
const projectViewerKey = 'proj-viewer';
const projectKey = 'proj-1234';
const siteProjectKey = 'proj-site';
const notebookProjectKey = 'proj-notebook';
const storageProjectKey = 'proj-storage';
const name = 'name';

const roles = {
  instanceAdmin: true,
  projectAdmin: [projectKey, projectAdminKey],
  projectUser: [projectKey, projectUserKey],
  projectViewer: [projectKey, projectViewerKey],
  siteOwner: [{ projectKey, name }, { projectKey: siteProjectKey, name }],
  notebookOwner: [{ projectKey, name }, { projectKey: notebookProjectKey, name }],
  storageAccess: [{ projectKey, name }, { projectKey: storageProjectKey, name }],
};

describe('userSummary', () => {
  it('shows full summary if all filters off', () => {
    // Arrange
    const filters = { filter1: false };

    // Act/Assert
    expect(userSummary(filters, roles)).toEqual('4 projects, 2 sites, 2 notebooks, 2 data stores');
  });

  it('shows number of viewer projects', () => {
    // Arrange
    const filters = { projectViewer: true };

    // Act/Assert
    expect(userSummary(filters, roles)).toEqual('2 projects');
  });

  it('shows number of user projects', () => {
    // Arrange
    const filters = { projectUser: true };

    // Act/Assert
    expect(userSummary(filters, roles)).toEqual('2 projects');
  });

  it('shows number of admin projects', () => {
    // Arrange
    const filters = { projectAdmin: true };

    // Act/Assert
    expect(userSummary(filters, roles)).toEqual('2 projects');
  });

  it('shows number of admin/user/viewer projects', () => {
    // Arrange
    const filters = { projectViewer: true, projectUser: true, projectAdmin: true };

    // Act/Assert
    expect(userSummary(filters, roles)).toEqual('4 projects');
  });

  it('shows number of sites owned', () => {
    // Arrange
    const filters = { siteOwner: true };

    // Act/Assert
    expect(userSummary(filters, roles)).toEqual('2 sites');
  });

  it('shows number of notebooks owned', () => {
    // Arrange
    const filters = { notebookOwner: true };

    // Act/Assert
    expect(userSummary(filters, roles)).toEqual('2 notebooks');
  });

  it('shows number of data stores accessible', () => {
    // Arrange
    const filters = { storageAccess: true };

    // Act/Assert
    expect(userSummary(filters, roles)).toEqual('2 data stores');
  });
});
