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

async function isMemberOfProject(projectKey, token) {
  logger.debug(`Checking user membership for project ${projectKey}`);

  const { data: exists } = await axios.get(`${authServiceUrl}/projects/${projectKey}/is-member`, generateOptions(token));

  return exists;
}

async function setInstanceAdmin(userId, instanceAdmin, token) {
  logger.debug(`Setting instanceAdmin of ${userId} to ${instanceAdmin}`);
  const body = { instanceAdmin };
  const { data } = await axios.put(`${authServiceUrl}/roles/${userId}/systemRole`, body, generateOptions(token));
  return { userId, instanceAdmin: data.instanceAdmin };
}

async function setDataManager(userId, dataManager, token) {
  logger.debug(`Setting dataManager of ${userId} to ${dataManager}`);
  const body = { dataManager };
  const { data } = await axios.put(`${authServiceUrl}/roles/${userId}/systemRole`, body, generateOptions(token));
  return { userId, dataManager: data.dataManager };
}

async function setCatalogueRole(userId, catalogueRole, token) {
  logger.debug(`Setting catalogueRole of ${userId} to ${catalogueRole}`);
  const body = { catalogueRole };
  const { data } = await axios.put(`${authServiceUrl}/roles/${userId}/systemRole`, body, generateOptions(token));
  return { userId, catalogueRole: data.catalogueRole };
}

const generateOptions = token => ({
  headers: {
    authorization: token,
  },
});

export default { getAll, getProjectUsers, getUserName, isMemberOfProject, setInstanceAdmin, setDataManager, setCatalogueRole };
