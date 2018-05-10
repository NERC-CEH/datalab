import userManagement from '../userManagement/userManagement';

function getUsers(req, res) {
  return userManagement.getUsers()
    .then(users => res.json({ users }));
}

export default { getUsers };
