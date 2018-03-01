import axios from 'axios';
import logger from 'winston';
import { get } from 'lodash';
import config from '../config';
import axiosErrorHandler from '../util/errorHandlers';

const authZeroUrl = 'https://mjbr.eu.auth0.com/userinfo';
const authPermissionsUrl = `${config.get('authorisationService')}/permissions`;
const authServiceStub = config.get('authorisationServiceStub');

function getUserInfo(authZeroToken) {
  logger.debug('Requesting user info from Auth0');

  return axios.get(authZeroUrl, { headers: { authorization: authZeroToken } })
    .then(response => response.data)
    .catch(axiosErrorHandler('Unable to get user info'));
}

function getUserPermissions(authZeroToken) {
  logger.debug('Requesting user permissions from auth service');

  if (authServiceStub) {
    return Promise.resolve([
      'project:stacks:create',
      'project:stacks:delete',
      'project:stacks:list',
      'project:stacks:open',
      'project:storage:create',
      'project:storage:delete',
      'project:storage:list',
      'project:storage:open',
    ]);
  }

  return axios.get(authPermissionsUrl, { headers: { authorization: authZeroToken } })
    .then(response => get(response, 'data.permissions') || [])
    .catch(axiosErrorHandler('Unable to get user permissions'));
}

export default { getUserInfo, getUserPermissions };
