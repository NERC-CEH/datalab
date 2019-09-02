import axios from 'axios';
import logger from 'winston';
import config from '../config';

const authServiceUrl = `${config.get('authorisationService')}`;

function getAll({ token }) {
  return axios.get(`${authServiceUrl}/users`, generateOptions(token))
    .then(response => response.data);
}

function getProjectUsers(projectKey, token) {
  logger.debug(`Loading permissions for project ${projectKey}`);
  return axios.get(`${authServiceUrl}/projects/${projectKey}/users`, generateOptions(token))
    .then(response => response.data)
    .then((users) => {
      console.log(users);
      return users;
    });
}

function getUserName(user) {
  return Promise.resolve(`${user.userId}`);
}

const generateOptions = token => ({
  headers: {
    authorization: token,
  },
});

export default { getAll, getProjectUsers, getUserName };
