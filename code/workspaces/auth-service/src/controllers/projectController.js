import find from 'lodash/find';
import { check } from 'express-validator';
import validator from './validationMiddleware';
import userRolesRepository from '../dataaccess/userRolesRepository';
import { PROJECT_ROLES } from '../models/userRoles.model';

async function getUserRoles(req, res) {
  const { params: { projectName } } = req;
  const userPermissions = await userRolesRepository.getProjectUsers(projectName);

  const mappedUsers = userPermissions.map(user => ({
    userId: user.userId,
    role: find(user.projectRoles, { projectName }).role,
  }));

  res.send(mappedUsers);
}

async function addUserRole(req, res) {
  const { params: { projectName, userId } } = req;
  const { body: { role } } = req;

  const roleAdded = await userRolesRepository.addRole(userId, projectName, role);

  const statusCode = roleAdded ? 201 : 200;
  res.status(statusCode).send();
}

async function removeUserRole(req, res) {
  const { params: { projectName, userId } } = req;

  await userRolesRepository.removeRole(userId, projectName);

  res.status(204).send();
}

export const addRoleValidator = validator([
  check('projectName').isAlphanumeric(),
  check('userId').isAlphanumeric(),
  check('role', `Role must be one of ${PROJECT_ROLES}`).isIn(PROJECT_ROLES),
]);

export const removeRoleValidator = validator([
  check('projectName').isAlphanumeric(),
  check('userId').isAlphanumeric(),
]);

export default { getUserRoles, addUserRole, removeUserRole };
