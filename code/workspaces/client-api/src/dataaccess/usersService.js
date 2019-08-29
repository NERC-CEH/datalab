import axios from 'axios';
import logger from 'winston';
import config from '../config';

const authUsersUrl = `${config.get('authorisationService')}/users`;

function getAll({ token }) {
  return axios.get(authUsersUrl, generateOptions(token))
    .then(response => response.data);
}

function getProjectUsers(projectName) {
  logger.debug(`Loading permissions for project ${projectName}`);
  return Promise.resolve([
    {
      id: 123,
      role: 'ADMIN',
    },
    {
      id: 234,
      role: 'USER',
    },
    {
      id: 345,
      role: 'VIEWER',
    },
  ]);
}

function getUserName(user) {
  return Promise.resolve(`username${user.id}`);
}

const generateOptions = token => ({
  headers: {
    authorization: token,
  },
});

export default { getAll, getProjectUsers, getUserName };
