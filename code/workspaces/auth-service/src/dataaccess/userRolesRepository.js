import database from '../config/database';

function UserRoles() {
  return database.getModel('UserRoles');
}

// In line with other repository functions, this returns a promise,
// but the model document is first converted to an object so the spread operator works as expected.
function getRoles(userId) {
  return UserRoles().findOne({ userId }).exec().then(document => document.toObject());
}

function getProjectUsers(projectName) {
  const query = { 'projectRoles.projectName': { $eq: projectName } };
  return UserRoles().find(query).exec();
}

export default { getRoles, getProjectUsers };
