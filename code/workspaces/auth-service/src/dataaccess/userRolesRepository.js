import findIndex from 'lodash/findIndex';
import remove from 'lodash/remove';
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

async function addRole(userId, projectName, role) {
  // Load existing user
  let roleAdded = false;
  const query = { userId };
  let user = await UserRoles().findOne(query).exec();

  if (user) {
    // Either add role or update existing role
    const { projectRoles } = user;
    const roleIndex = findIndex(projectRoles, { projectName });
    if (roleIndex > -1) {
      projectRoles[roleIndex].role = role;
    } else {
      roleAdded = true;
      projectRoles.push({ projectName, role });
    }
  } else {
    // Add new user entry if not found
    roleAdded = true;
    user = {
      userId,
      projectRoles: [{ projectName, role }],
    };
  }

  await UserRoles().findOneAndUpdate(query, user, { upsert: true, setDefaultsOnInsert: true, runValidators: true });
  return roleAdded;
}

async function removeRole(userId, projectName) {
  const query = { userId };
  const user = await UserRoles().findOne(query).exec();

  if (user) {
    const { projectRoles } = user;
    const roleIndex = findIndex(projectRoles, { projectName });
    if (roleIndex > -1) {
      remove(projectRoles, { projectName });
      await UserRoles()
        .findOneAndUpdate(query, user, { upsert: true, setDefaultsOnInsert: true, runValidators: true });
    }
  }
}

export default { getRoles, getProjectUsers, addRole, removeRole };
