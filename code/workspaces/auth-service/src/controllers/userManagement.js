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

async function setInstanceAdmin(req, res) {
  const { params: { userId } } = req;
  const { body: { instanceAdmin } } = req;
  try {
    const roles = await userRolesRepository.setInstanceAdmin(userId, instanceAdmin);
    res.status(200).send(roles);
  } catch (err) {
    logger.error(`setInstanceAdmin: ${err.message}`);
    res.status(500);
    res.send({});
  }
}

async function setCatalogueRole(req, res) {
  const { params: { userId } } = req;
  const { body: { catalogueRole } } = req;
  try {
    const roles = await userRolesRepository.setCatalogueRole(userId, catalogueRole);
    res.status(200).send(roles);
  } catch (err) {
    logger.error(`setCatalogueRole: ${err.message}`);
    res.status(500);
    res.send({});
  }
}

export const userIdValidator = validator([
  check('userId').isAscii(),
]);

export default { getUsers, getUser, getAllUsersAndRoles, setInstanceAdmin, setCatalogueRole };
