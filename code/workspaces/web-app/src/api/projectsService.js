import { gqlQuery, gqlMutation } from './graphqlClient';
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

function createProject(project) {
  const mutation = `
    CreateProject($project: ProjectCreationRequest) {
      createProject(project: $project) { id }
    }`;

  return gqlMutation(mutation, { project })
    .then(errorHandler('data.createProject'));
}

function checkProjectKeyUniqueness(projectKey) {
  const query = `
    CheckProjectKeyUniqueness($projectKey: String!) {
      checkProjectKeyUniqueness(projectKey: $projectKey)
    }`;

  return gqlQuery(query, { projectKey })
    .then(errorHandler('data.checkProjectKeyUniqueness'));
}

export default { loadProjects, loadProjectInfo, createProject, checkProjectKeyUniqueness };
