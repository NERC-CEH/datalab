import { check } from 'express-validator';
import logger from 'winston';
import validator from './validationMiddleware';
import userRolesRepository from '../dataaccess/userRolesRepository';

async function getUsers(req, res) {
  try {
    const users = await userRolesRepository.getUsers();
    res.json(users);
  } catch (err) {
    logger.error(err);
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
    logger.error(err);
    res.status(404);
    res.send({});
  }
}

async function getAllUsersAndRoles(req, res) {
  try {
    const users = await userRolesRepository.getAllUsersAndRoles();
    res.json(users);
  } catch (err) {
    logger.error(err);
    res.status(500);
    res.send({});
  }
}

export const getUserValidator = validator([
  check('userId').isAscii(),
]);

export default { getUsers, getUser, getAllUsersAndRoles };
