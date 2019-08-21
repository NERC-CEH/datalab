import database from '../config/database';

function UserRoles() {
  return database.getModel('UserRoles');
}

// In line with other repository functions, this returns a promise,
// but the model document is first converted to an object so the spread operator works as expected.
function getRoles(userId) {
  return UserRoles().findOne({ userId }).exec().then(document => document.toObject());
}

export default getRoles;
