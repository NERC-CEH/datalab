import authZeroUserMgmt from '../userManagement/authZeroUserManagement';

function getUsers(req, res) {
  return authZeroUserMgmt.getUsers()
    .then(users => res.json({ users }));
}

export default { getUsers };
