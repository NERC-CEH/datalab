import { gqlQuery } from './graphqlClient';
import errorHandler from './graphqlErrorHandler';

function loadProjects() {
  const query = `
    LoadProjects {
      projects {
        id, key, name, description, accessible
      }
    }`;

  return gqlQuery(query)
    .then(errorHandler('data.projects'));
}

function loadProjectInfo(projectKey) {
  const query = `
    LoadProjectInfo($projectKey: String!) {
      project(projectKey: $projectKey) {
        id, key, name, description
      }
    }`;

  return gqlQuery(query, { projectKey })
    .then(errorHandler('data.project'));
}

export default { loadProjects, loadProjectInfo };
