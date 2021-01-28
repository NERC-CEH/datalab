import { check } from 'express-validator';
import logger from 'winston';
import validator from './validationMiddleware';
import userRolesRepository from '../dataaccess/userRolesRepository';

async function getUsers(req, res) {
  try {
    const users = await userRolesRepository.getUsers();
    res.json(users);
  } catch (err) {
    logger.error(`getUsers: ${err.message}`);
    res.status(500);
    res.send({});
  }
}

async function getUser(req, res) {
  const { params: { userId } } = req;

  try {
    const user = await userRolesRepository.getUser(userId);
    res.send(user);
  } catch (err) {
    logger.error(`getUser: ${err.message}`);
    res.status(404);
    res.send({});
  }
}

async function getAllUsersAndRoles(req, res) {
  try {
    const users = await userRolesRepository.getAllUsersAndRoles();
    res.json(users);
  } catch (err) {
    logger.error(`getAllUsersAndRoles: ${err.message}`);
    res.status(500);
    res.send({});
  }
}

// Note - roleKey must exist in UserRolesSchema in userRoles.model.js
async function setSystemRole(req, res) {
  const { params: { userId } } = req;
  const systemRoles = req.body;
  const roleKeys = Object.keys(req.body);
  if (roleKeys.length !== 1) {
    logger.error(`setSystemRole: expected one role, found ${roleKeys.length}`);
    res.status(400);
    res.send({});
    return;
  }
  const roleKey = roleKeys[0];
  const roleValue = systemRoles[roleKey];
  try {
    const roles = await userRolesRepository.setSystemRole(userId, roleKey, roleValue);
    res.status(200).send(roles);
  } catch (err) {
    logger.error(`setSystemRole: ${err.message}`);
    res.status(500);
    res.send({});
  }
}

export const userIdValidator = validator([
  check('userId').isAscii(),
]);

export default { getUsers, getUser, getAllUsersAndRoles, setSystemRole };
