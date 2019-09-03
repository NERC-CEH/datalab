import { check } from 'express-validator';
import authZeroUserMgmt from '../userManagement/authZeroUserManagement';
import validator from './validationMiddleware';

function getUsers(req, res) {
  return authZeroUserMgmt.getUsers()
    .then(users => res.json(users));
}

async function getUser(req, res) {
  const { params: { userId } } = req;

  const user = await authZeroUserMgmt.getUser(userId);

  if (!user) {
    res.status(404);
  }
  res.send(user);
}

export const getUserValidator = validator([
  check('userId').isAscii(),
]);

export default { getUsers, getUser };
