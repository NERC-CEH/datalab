import find from 'lodash/find';
import { check } from 'express-validator';
import validator from './validationMiddleware';
import userRolesRepository from '../dataaccess/userRolesRepository';
import { PROJECT_ROLES } from '../models/userRoles.model';

async function isMember(req, res) {
  const { params: { projectKey }, user: { sub } } = req;
  const exists = await userRolesRepository.userIsMember(sub, projectKey);

  res.status(200).send(exists);
}

async function getUserRoles(req, res) {
  const { params: { projectKey } } = req;
  const userPermissions = await userRolesRepository.getProjectUsers(projectKey);

  const mappedUsers = userPermissions.map(user => ({
    userId: user.userId,
    role: find(user.projectRoles, { projectKey }).role,
  }));

  res.send(mappedUsers);
}

async function addUserRole(req, res) {
  const { params: { projectKey, userId } } = req;
  const { body: { role } } = req;

  const roleAdded = await userRolesRepository.addRole(userId, projectKey, role);

  const statusCode = roleAdded ? 201 : 200;
  res.status(statusCode).send();
}

async function removeUserRole(req, res) {
  const { params: { projectKey, userId } } = req;

  const roleRemoved = await userRolesRepository.removeRole(userId, projectKey);

  res.status(200).send({ roleRemoved });
}

export const addRoleValidator = validator([
  check('projectKey').isAlphanumeric(),
  check('userId').isAscii(),
  check('role', `Role must be one of ${PROJECT_ROLES}`).isIn(PROJECT_ROLES),
]);

export const removeRoleValidator = validator([
  check('projectKey').isAlphanumeric(),
  check('userId').isAscii(),
]);

export default { getUserRoles, addUserRole, removeUserRole, isMember };
