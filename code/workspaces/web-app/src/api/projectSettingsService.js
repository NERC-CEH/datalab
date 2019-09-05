import { gqlQuery } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

export default function getProjectUsers(projectId) {
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
