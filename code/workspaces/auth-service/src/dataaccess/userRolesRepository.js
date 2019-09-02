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

function getProjectUsers(projectKey) {
  const query = { 'projectRoles.projectKey': { $eq: projectKey } };
  return UserRoles().find(query).exec();
}

async function addRole(userId, projectKey, role) {
  // Load existing user
  let roleAdded = false;
  const query = { userId };
  let user = await UserRoles().findOne(query).exec();

  if (user) {
    // Either add role or update existing role
    const { projectRoles } = user;
    const roleIndex = findIndex(projectRoles, { projectKey });
    if (roleIndex > -1) {
      projectRoles[roleIndex].role = role;
    } else {
      roleAdded = true;
      projectRoles.push({ projectKey, role });
    }
  } else {
    // Add new user entry if not found
    roleAdded = true;
    user = {
      userId,
      projectRoles: [{ projectKey, role }],
    };
  }

  await UserRoles().findOneAndUpdate(query, user, { upsert: true, setDefaultsOnInsert: true, runValidators: true });
  return roleAdded;
}

async function removeRole(userId, projectKey) {
  const query = { userId };
  const user = await UserRoles().findOne(query).exec();

  if (user) {
    const { projectRoles } = user;
    const roleIndex = findIndex(projectRoles, { projectKey });
    if (roleIndex > -1) {
      remove(projectRoles, { projectKey });
      await UserRoles()
        .findOneAndUpdate(query, user, { upsert: true, setDefaultsOnInsert: true, runValidators: true });
    }
  }
}

export default { getRoles, getProjectUsers, addRole, removeRole };
