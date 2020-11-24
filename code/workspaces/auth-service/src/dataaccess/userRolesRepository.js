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
    roles = await addRecordForNewUser(userId, userName, []);
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
  const usersMap = allRoles
    .filter(roles => roles.userName) // only take users with known user names
    .map(roles => convertToUser(roles)) // convert to users
    .reduce((uniqueUsersMap, user) => { // convert to map, keyed by userId
      uniqueUsersMap[user.userId] = user; // eslint-disable-line no-param-reassign
      return uniqueUsersMap;
    }, {});
  return Object.values(usersMap); // return users
}

async function getAllUsersAndRoles() {
  const allRoles = await UserRoles().find().exec();
  const usersMap = allRoles
    .filter(roles => roles.userName) // only take users with known user names
    .reduce((uniqueUsersMap, roles) => { // convert to map, keyed by userId
      uniqueUsersMap[roles.userId] = roles; // eslint-disable-line no-param-reassign
      return uniqueUsersMap;
    }, {});
  return Object.values(usersMap); // return users and roles
}

function getProjectUsers(projectKey) {
  const query = { 'projectRoles.projectKey': { $eq: projectKey } };
  return UserRoles().find(query).exec();
}

function addRecordForNewUser(userId, userName, projectRoles) {
  const user = {
    userId,
    userName,
    projectRoles,
    instanceAdmin: false,
  };
  return UserRoles().create(user);
}

async function addRole(userId, projectKey, role) {
  // Load existing user
  const query = { userId };
  const user = await UserRoles().findOne(query).exec();

  if (!user) {
    throw new Error(`Unrecognized user ${userId}`);
  }
  // Either add role or update existing role
  const { projectRoles } = user;
  const roleIndex = findIndex(projectRoles, { projectKey });
  const roleAdded = roleIndex === -1;
  if (roleAdded) {
    projectRoles.push({ projectKey, role });
  } else {
    projectRoles[roleIndex].role = role;
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

export default { getRoles, getUser, getUsers, getAllUsersAndRoles, getProjectUsers, addRole, removeRole, userIsMember };
