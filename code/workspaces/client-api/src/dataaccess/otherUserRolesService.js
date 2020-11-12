import axios from 'axios';
import logger from 'winston';
import { get } from 'lodash';
import config from '../config';
import axiosErrorHandler from '../util/errorHandlers';

const authServiceUrl = `${config.get('authorisationService')}`;
const infraServiceUrl = `${config.get('infrastructureApi')}`;

export function getProjectKeysWithRole(authRoles, roles) {
  return authRoles.projectRoles
    .filter(projectRole => roles.includes(projectRole.role))
    .map(projectRole => projectRole.projectKey);
}

async function getOtherUserRoles(userId, token) {
  logger.debug(`Loading roles for user ${userId}`);

  try {
    const responses = await Promise.all([
      axios.get(`${authServiceUrl}/roles/${userId}`, { headers: { authorization: token } }),
      axios.get(`${infraServiceUrl}/userresources/${userId}`, { headers: { authorization: token } }),
    ]);

    const { userRoles } = get(responses[0], 'data');
    const { storageAccess, notebookOwner, siteOwner } = get(responses[1], 'data');

    return {
      instanceAdmin: userRoles.instanceAdmin,
      projectAdmin: getProjectKeysWithRole(userRoles, ['admin']),
      projectUser: getProjectKeysWithRole(userRoles, ['admin', 'user']),
      projectViewer: getProjectKeysWithRole(userRoles, ['admin', 'user', 'viewer']),
      siteOwner,
      notebookOwner,
      storageAccess,
    };
  } catch (err) {
    return axiosErrorHandler(`Unable to get user roles for ${userId}`);
  }
}

export default { getOtherUserRoles };
