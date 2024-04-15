import { gqlQuery, gqlMutation } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

export function getProjectUsers(projectKey) {
  const query = `
    GetProjectUsers($projectKey: String!) {
      project(projectKey: $projectKey) {
        projectUsers {
          userId, name, role, verified
        },
      }
    }`;

  return gqlQuery(query, { projectKey })
    .then(errorHandler('data.project.projectUsers'));
}

export function addProjectUserPermission(projectKey, userId, role) {
  const mutation = `
    AddProjectPermission($permission: PermissionAddRequest) {
      addProjectPermission(permission: $permission) {
        projectKey, role
      }
    }`;

  return gqlMutation(mutation, { permission: { projectKey, userId, role } })
    .then(errorHandler('data.addProjectPermission'));
}

export function removeProjectPermission(projectKey, userId) {
  const mutation = `
    RemoveProjectPermission($permission: PermissionRemoveRequest) {
      removeProjectPermission(permission: $permission)
    }`;

  return gqlMutation(mutation, { permission: { projectKey, userId } })
    .then(errorHandler('data.removeProjectPermission'));
}
