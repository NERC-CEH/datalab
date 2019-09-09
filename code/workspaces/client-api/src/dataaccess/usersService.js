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
    .then(response => response.data);
}

async function getUserName(userId, token) {
  logger.debug(`Loading user name for user ${userId}`);

  try {
    const response = await axios.get(`${authServiceUrl}/users/${userId}`, generateOptions(token));
    return response.data.name;
  } catch (err) {
    if (err.response.status === 404) {
      logger.warn(`No user name found for userId: ${userId}`);
    }

    logger.error(`Unable to load user name for userId: ${userId}`);
    return 'Not known';
  }
}

function isMemberOfProject(projectKey) {
  logger.debug(`Checking user membership for project ${projectKey}`);
  // This is a temporary dummy value which will require another route to be
  // added to the auth-service.
  return true;
}

const generateOptions = token => ({
  headers: {
    authorization: token,
  },
});

export default { getAll, getProjectUsers, getUserName, isMemberOfProject };
