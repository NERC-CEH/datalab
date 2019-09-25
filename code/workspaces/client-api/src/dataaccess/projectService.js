import axios from 'axios';
import logger from 'winston';
import config from '../config';

const authServiceUrl = `${config.get('authorisationService')}`;
const infraServiceUrl = `${config.get('infrastructureApi')}`;

async function listProjects(token) {
  const response = await axios.get(`${infraServiceUrl}/projects`, generateOptions(token));
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

async function createProject(creationRequest, token) {
  const project = projectActionRequestToProject(creationRequest);
  const response = await axios.post(`${infraServiceUrl}/projects`, project, generateOptions(token));
  return response.data;
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
  logger.debug(`Adding ${role} role to user ${userId} for project ${projectKey}`);
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
  getProjectByKey,
  isProjectKeyUnique,
  createProject,
  updateProject,
  deleteProject,
  addProjectPermission,
  removeProjectPermission,
};
