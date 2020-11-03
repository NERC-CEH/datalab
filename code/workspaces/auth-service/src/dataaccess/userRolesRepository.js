import findIndex from 'lodash/findIndex';
import remove from 'lodash/remove';
import database from '../config/database';

function UserRoles() {
  return database.getModel('UserRoles');
}

// In line with other repository functions, this returns a promise,
// but the model document is first converted to an object so the spread operator works as expected.
async function getRoles(userId, userName) {
  let roles = await UserRoles().findOne({ userId }).exec();
  if (!roles) {
    roles = await addEmptyRecordForNewUser(userId, userName);
  }

  return roles.toObject();
}

function convertToUser(roles) {
  const userRoles = roles.toObject();
  const userName = userRoles.userName ? userRoles.userName : 'Unknown user name';
  const user = { userId: userRoles.userId, name: userName };
  return user;
}

async function getUser(userId) {
  const roles = await UserRoles().findOne({ userId }).exec();
  return convertToUser(roles);
}

async function getUsers() {
  const allRoles = await UserRoles().find().exec();
  return allRoles.map(roles => convertToUser(roles));
}

function getProjectUsers(projectKey) {
  const query = { 'projectRoles.projectKey': { $eq: projectKey } };
  return UserRoles().find(query).exec();
}

function addEmptyRecordForNewUser(userId, userName) {
  const user = {
    userId,
    userName,
    projectRoles: [],
    instanceAdmin: false,
  };
  return UserRoles().create(user);
}

async function addRole(userId, userName, projectKey, role) {
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
      userName,
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
      const options = { upsert: true, setDefaultsOnInsert: true, runValidators: true };
      await UserRoles().findOneAndUpdate(query, user, options);
      return true;
    }
  }
  return false;
}

async function userIsMember(userId, projectKey) {
  const query = { userId: { $eq: userId }, 'projectRoles.projectKey': { $eq: projectKey } };
  return UserRoles().exists(query);
}

export default { getRoles, getUser, getUsers, getProjectUsers, addRole, removeRole, userIsMember };
