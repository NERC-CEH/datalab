import { gqlQuery, gqlMutation } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

export function getProjectUsers(projectId) {
  const query = `
    GetProjectUsers($projectId: String!) {
      project(key: $projectId) {
        projectUsers { 
          userId, name, role
        },
      }
    }`;

  return gqlQuery(query, { projectId })
    .then(errorHandler('data.project.projectUsers'));
}

export function addProjectUserPermission(projectKey, userId, role) {
  const mutation = `
    AddProjectPermission($request: PermissionAddRequest) {
      addProjectPermission(permission: $request) { 
        projectKey, role
      }
    }`;

  return gqlMutation(mutation, { request: { projectKey, userId, role } })
    .then(errorHandler('data.addProjectPermission'));
}
