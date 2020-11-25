import axios from 'axios';
import logger from 'winston';
import config from '../config';
import axiosErrorHandler from '../util/errorHandlers';

const authServiceUrl = config.get('authorisationService');

async function getAllUsersAndRoles(token) {
  logger.debug('Loading all users and roles');

  try {
    const response = await axios.get(`${authServiceUrl}/roles`, { headers: { authorization: token } });

    return response.data.map(roles => ({ ...roles, name: roles.userName }));
  } catch (err) {
    return axiosErrorHandler('Unable to get all users and roles')(err);
  }
}

export default { getAllUsersAndRoles };
