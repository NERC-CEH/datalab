import axios from 'axios';
import logger from 'winston';
import config from '../config';

const authServiceUrl = `${config.get('authorisationService')}`;

function getProjectByKey(projectKey) {
  return Promise.resolve({
    id: 123,
    name: 'project',
    key: projectKey,
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

export default { getProjectByKey, addProjectPermission, removeProjectPermission };
