import axios from 'axios';
import logger from 'winston';
import config from '../config';

const authServiceUrl = `${config.get('authorisationService')}`;

function listProjects() {
  return Promise.resolve([
    {
      id: 123,
      name: 'project',
      key: 'project',
      tags: ['alpha', 'beta', 'gamma'],
      collaborationLink: 'https://testlab.test-datalabs.nerc.ac.uk/',
    },
    {
      id: 222,
      name: 'project2',
      key: 'project2',
    },
    {
      id: 333,
      name: 'project3',
      key: 'project3',
    },
    {
      id: 321,
      name: 'another',
      key: 'another',
    },
  ]);
}

function getProjectByKey(projectKey) {
  return Promise.resolve({
    id: 123,
    name: 'project',
    key: projectKey,
  });
}

function createProject({ projectKey, ...rest }) {
  logger.debug(`Creating project ${projectKey}`);
  return Promise.resolve({
    id: 321,
    key: projectKey,
    ...rest,
  });
}

function updateProject({ projectKey, ...rest }) {
  logger.debug(`Updating project ${projectKey}`);
  return Promise.resolve({
    id: 321,
    key: projectKey,
    ...rest,
  });
}

function deleteProject(projectKey) {
  logger.debug(`Deleting project ${projectKey}`);
  return Promise.resolve({
    id: 321,
    key: projectKey,
    name: 'notNeeded',
    tags: [],
    collaborationLink: undefined,
  });
}

function addProjectPermission(projectKey, userId, role, token) {
  logger.debug(`Adding ${role} role to user ${userId} for project ${projectKey}`);
  const body = { role };
  return axios.put(`${authServiceUrl}/projects/${projectKey}/users/${userId}/roles`, body, generateOptions(token))
    .then(() => ({
      projectKey,
      role,
    }));
}

function removeProjectPermission(projectKey, userId, token) {
  logger.debug(`Removing permissions from user ${userId} for project ${projectKey}`);
  return axios.delete(`${authServiceUrl}/projects/${projectKey}/users/${userId}/role`, generateOptions(token))
    .then(() => true);
}

const generateOptions = token => ({
  headers: {
    authorization: token,
  },
});

export default {
  listProjects,
  getProjectByKey,
  createProject,
  updateProject,
  deleteProject,
  addProjectPermission,
  removeProjectPermission,
};
