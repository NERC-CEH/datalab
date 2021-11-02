import axios from 'axios';
import logger from 'winston';
import config from '../config';

const authServiceUrl = config.get('authorisationService');
const infraServiceUrl = config.get('infrastructureApi');

async function listProjects(token) {
  const response = await axios.get(`${infraServiceUrl}/projects`, generateOptions(token));
  return response.data;
}

async function getAllProjectsAndResources(token) {
  const response = await axios.get(`${infraServiceUrl}/resources`, generateOptions(token));
  return response.data;
}

async function getProjectByKey(projectKey, token) {
  const response = await axios.get(`${infraServiceUrl}/projects/${projectKey}`, generateOptions(token));
  return response.data;
}

async function isProjectKeyUnique(projectKey, token) {
  const response = await axios.get(`${infraServiceUrl}/projects/${projectKey}/isunique`, generateOptions(token));
  return response.data;
}

async function createProject(creationRequest, user, token) {
  const project = projectActionRequestToProject(creationRequest);
  const owner = user.sub;
  const response = await axios.post(`${infraServiceUrl}/projects`, project, generateOptions(token));
  try {
    await addProjectPermission(project.key, owner, 'admin', token);
  } catch (error) {
    logger.error(`Failed to add user ${owner} to project ${project.key}: ${error}`);
  }

  return response.data;
}

async function requestProject(creationRequest, user, token) {
  const project = projectActionRequestToProject(creationRequest);
  project.owner = user.sub;

  const newProjectNotification = {
    title: 'New Project Request',
    message: JSON.stringify(project, null, 2),
    userIDs: project.owner,
  };
  await axios.post(`${infraServiceUrl}/notifications`, newProjectNotification, generateOptions(token));
}

async function updateProject(updateRequest, token) {
  const project = projectActionRequestToProject(updateRequest);
  const response = await axios.put(`${infraServiceUrl}/projects/${project.key}`, project, generateOptions(token));
  return response.data;
}

async function deleteProject(projectKey, token) {
  const response = await axios.delete(`${infraServiceUrl}/projects/${projectKey}`, generateOptions(token));
  return response.data;
}

function addProjectPermission(projectKey, userId, role, token) {
  logger.info(`Adding ${role} role to user ${userId} for project ${projectKey}`);
  const body = { role };
  return axios.put(`${authServiceUrl}/projects/${projectKey}/users/${userId}/roles`, body, generateOptions(token))
    .then(() => ({
      userId,
      projectKey,
      role,
    }));
}

function removeProjectPermission(projectKey, userId, token) {
  logger.debug(`Removing permissions from user ${userId} for project ${projectKey}`);
  return axios.delete(`${authServiceUrl}/projects/${projectKey}/users/${userId}/role`, generateOptions(token))
    .then(response => response.data.roleRemoved);
}

async function getMultipleProjects(projectKeys, token) {
  // Returns an array of projects, useful if nested in another object e.g. central asset metadata
  // Filters out projects which throw an error since they probably don't exist any more.
  const projectsPromise = projectKeys
    ? Promise.all(projectKeys // do in Promise.all for performance
      .map(projectKey => getProjectByKey(projectKey, token).catch(() => undefined))) // get the project, or undefined if throws an error
    : []; // if projectKeys undefined, return an empty array
  const projects = await projectsPromise;
  return projects.filter(project => project); // filter out non-existent projects
}

const generateOptions = token => ({
  headers: {
    authorization: token,
  },
});

export function projectActionRequestToProject(actionRequest) {
  const project = { ...actionRequest, key: actionRequest.projectKey };
  delete project.projectKey;
  return project;
}

export default {
  listProjects,
  getAllProjectsAndResources,
  getProjectByKey,
  isProjectKeyUnique,
  createProject,
  requestProject,
  updateProject,
  deleteProject,
  addProjectPermission,
  removeProjectPermission,
  getMultipleProjects,
};
