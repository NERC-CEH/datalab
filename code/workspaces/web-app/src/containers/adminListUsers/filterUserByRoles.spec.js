import filterUserByRoles from './filterUserByRoles';

const userId = 'user-1';
const projectKey = 'project-1234';
const name = 'resource-name';

describe('filterUserByRoles', () => {
  it('shows user if all filters are off', () => {
    // Arrange
    const filters = { filter1: false };
    const otherUserRoles = {};

    // Act/Assert
    expect(filterUserByRoles(userId, filters, otherUserRoles)).toEqual(true);
  });

  it('does not show user if we are filtering and the user has no roles', () => {
    // Arrange
    const filters = { filter1: true };
    const otherUserRoles = {};

    // Act/Assert
    expect(filterUserByRoles(userId, filters, otherUserRoles)).toEqual(false);
  });

  it('shows user if match instanceAdmin filter', () => {
    // Arrange
    const filters = { instanceAdmin: true };
    const otherUserRoles = { [userId]: { instanceAdmin: true } };

    // Act/Assert
    expect(filterUserByRoles(userId, filters, otherUserRoles)).toEqual(true);
  });

  it('shows user if match catalogueAdmin filter', () => {
    // Arrange
    const filters = { catalogueAdmin: true };
    const otherUserRoles = { [userId]: { catalogueAdmin: true } };

    // Act/Assert
    expect(filterUserByRoles(userId, filters, otherUserRoles)).toEqual(true);
  });

  it('shows user if match cataloguePublisher filter', () => {
    // Arrange
    const filters = { cataloguePublisher: true };
    const otherUserRoles = { [userId]: { cataloguePublisher: true } };

    // Act/Assert
    expect(filterUserByRoles(userId, filters, otherUserRoles)).toEqual(true);
  });

  it('shows user if match catalogueEditor filter', () => {
    // Arrange
    const filters = { catalogueEditor: true };
    const otherUserRoles = { [userId]: { catalogueEditor: true } };

    // Act/Assert
    expect(filterUserByRoles(userId, filters, otherUserRoles)).toEqual(true);
  });

  it('shows user if match projectAdmin filter', () => {
    // Arrange
    const filters = { projectAdmin: true };
    const otherUserRoles = { [userId]: { projectAdmin: [projectKey] } };

    // Act/Assert
    expect(filterUserByRoles(userId, filters, otherUserRoles)).toEqual(true);
  });

  it('shows user if match projectUser filter', () => {
    // Arrange
    const filters = { projectUser: true };
    const otherUserRoles = { [userId]: { projectUser: [projectKey] } };

    // Act/Assert
    expect(filterUserByRoles(userId, filters, otherUserRoles)).toEqual(true);
  });

  it('shows user if match projectViewer filter', () => {
    // Arrange
    const filters = { projectViewer: true };
    const otherUserRoles = { [userId]: { projectViewer: [projectKey] } };

    // Act/Assert
    expect(filterUserByRoles(userId, filters, otherUserRoles)).toEqual(true);
  });

  it('shows user if match siteOwner filter', () => {
    // Arrange
    const filters = { siteOwner: true };
    const otherUserRoles = { [userId]: { siteOwner: [{ projectKey, name }] } };

    // Act/Assert
    expect(filterUserByRoles(userId, filters, otherUserRoles)).toEqual(true);
  });

  it('shows user if match notebookOwner filter', () => {
    // Arrange
    const filters = { notebookOwner: true };
    const otherUserRoles = { [userId]: { notebookOwner: [{ projectKey, name }] } };

    // Act/Assert
    expect(filterUserByRoles(userId, filters, otherUserRoles)).toEqual(true);
  });

  it('shows user if match storageAccess filter', () => {
    // Arrange
    const filters = { storageAccess: true };
    const otherUserRoles = { [userId]: { storageAccess: [{ projectKey, name }] } };

    // Act/Assert
    expect(filterUserByRoles(userId, filters, otherUserRoles)).toEqual(true);
  });

  it('does not show user if matches no filter', () => {
    // Arrange
    const filters = { instanceAdmin: true };
    const otherUserRoles = { [userId]: { instanceAdmin: false } };

    // Act/Assert
    expect(filterUserByRoles(userId, filters, otherUserRoles)).toEqual(false);
  });
});
