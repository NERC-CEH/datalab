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

function loadProjectInfo(key) {
  const query = `
    LoadProjectInfo($key: String!) {
      project(key: $key) {
        id, key, name, description
      }
    }`;

  return gqlQuery(query, { key })
    .then(errorHandler('data.project'));
}

export default { loadProjects, loadProjectInfo };
