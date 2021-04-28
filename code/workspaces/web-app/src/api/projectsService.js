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

async function getAllProjectsAndResources() {
  const query = `
    GetAllProjectsAndResources {
      allProjectsAndResources {
        projects {
          id, key, name, description, accessible
        }
        storage {
          id, projectKey, name, displayName, description, type, stacksMountingStore { id }, status, users
        }
        stacks {
          id, projectKey, category, displayName, name, users, type, description, status, shared, visible, version
        }
        clusters {
          id, type, projectKey, name, displayName, volumeMount, condaPath, maxWorkers, maxWorkerMemoryGb, maxWorkerCpu, schedulerAddress
        }
      }
    }`;

  const allProjectsAndResources = await gqlQuery(query)
    .then(errorHandler('data.allProjectsAndResources'));
  return allProjectsAndResources;
}

function loadProjectInfo(projectKey) {
  const query = `
    LoadProjectInfo($projectKey: String!) {
      project(projectKey: $projectKey) {
        id, key, name, description, collaborationLink
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

function updateProject(project) {
  const mutation = `
    UpdateProject($project: ProjectUpdateRequest) {
      updateProject(project: $project) { id }
    }`;

  return gqlMutation(mutation, { project })
    .then(errorHandler('data.updateProject'));
}

function deleteProject(projectKey) {
  const mutation = `
    DeleteProject($project: ProjectDeletionRequest) {
      deleteProject(project: $project)
    }`;

  return gqlMutation(mutation, { project: { projectKey } })
    .then(errorHandler('data.deleteProject'));
}

function checkProjectKeyUniqueness(projectKey) {
  const query = `
    CheckProjectKeyUniqueness($projectKey: String!) {
      checkProjectKeyUniqueness(projectKey: $projectKey)
    }`;

  return gqlQuery(query, { projectKey })
    .then(errorHandler('data.checkProjectKeyUniqueness'));
}

export default { loadProjects, getAllProjectsAndResources, loadProjectInfo, createProject, deleteProject, checkProjectKeyUniqueness, updateProject };
