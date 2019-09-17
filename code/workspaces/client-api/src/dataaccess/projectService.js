import axios from 'axios';
import logger from 'winston';
import config from '../config';

const authServiceUrl = `${config.get('authorisationService')}`;

const dummyProjects = [
  {
    id: 123,
    name: 'The project with key "project"',
    key: 'project',
    description: 'Once upon a time there was only one...',
    collaborationLink: 'https://testlab.test-datalabs.nerc.ac.uk/',
  },
  {
    id: 222,
    name: '"project2" is the key of this',
    key: 'project2',
    description: 'This is the second project.',
  },
  {
    id: 333,
    name: 'And this is "project3"',
    key: 'project3',
    description: 'This is another project.',
  },
  {
    id: 321,
    name: 'What?',
    key: 'projectX',
    description: 'No-one has permission to see this...',
  },
];

function listProjects() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyProjects);
    }, 2000);
  });
}

function getProjectByKey(projectKey) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        dummyProjects.filter(project => project.key === projectKey)[0],
      );
    }, 2000);
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

export default {
  listProjects,
  getProjectByKey,
  createProject,
  updateProject,
  deleteProject,
  addProjectPermission,
  removeProjectPermission,
};
