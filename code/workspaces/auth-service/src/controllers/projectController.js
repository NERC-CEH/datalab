import find from 'lodash/find';
import userRolesRepsoitory from '../dataaccess/userRolesRepository';

async function getUserRoles(req, res) {
  const { params: { projectName } } = req;
  const userPermissions = await userRolesRepsoitory.getProjectUsers(projectName);

  const mappedUsers = userPermissions.map(user => ({
    userId: user.userId,
    role: find(user.projectRoles, { projectName }).role,
  }));

  res.send(mappedUsers);
}

export default { getUserRoles };
