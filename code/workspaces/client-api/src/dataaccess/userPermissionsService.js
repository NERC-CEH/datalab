import axios from 'axios';
import logger from 'winston';
import { get } from 'lodash';
import config from '../config';
import { axiosErrorHandler } from '../util/errorHandlers';

const authPermissionsUrl = `${config.get('authorisationService')}/permissions`;
const authServiceStub = config.get('authorisationServiceStub');

const stubPermissions = [
  'project:stacks:create',
  'project:stacks:delete',
  'project:stacks:list',
  'project:stacks:open',
  'project:stacks:edit',
  'project:storage:create',
  'project:storage:delete',
  'project:storage:list',
  'project:storage:open',
  'project:users:list',
];

function getUserPermissions(identity, token) {
  const userName = identity ? identity.userName : null;
  logger.debug(`Requesting user permissions from auth service for userName ${userName}`);

  if (authServiceStub) {
    return Promise.resolve(stubPermissions);
  }

  return axios.get(authPermissionsUrl, {
    headers: { authorization: token },
    params: { userName },
  })
    .then(response => get(response, 'data.permissions') || [])
    .catch(axiosErrorHandler('Unable to get user permissions'));
}

export default { getUserPermissions };
