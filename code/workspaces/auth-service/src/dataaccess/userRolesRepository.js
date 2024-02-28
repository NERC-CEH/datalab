import { permissionTypes } from 'common';
import findIndex from 'lodash/findIndex';
import remove from 'lodash/remove';
import logger from 'winston';
import database from '../config/database';

const { INSTANCE_ADMIN_ROLE_KEY, DATA_MANAGER_ROLE_KEY, CATALOGUE_ROLE_KEY, CATALOGUE_USER_ROLE } = permissionTypes;

// Default roles that don't need storing in Mongo
const defaultRoles = {
  [INSTANCE_ADMIN_ROLE_KEY]: false,
  [DATA_MANAGER_ROLE_KEY]: false,
  [CATALOGUE_ROLE_KEY]: CATALOGUE_USER_ROLE,
};

function UserRoles() {
  return database.getModel('UserRoles');
}

function addDefaults(roles) {
  // The model document is first converted to an object so the spread operator works as expected.
  return {
    ...defaultRoles,
    ...roles.toObject(),
  };
}

async function getRoles(userId, userName) {
  let roles = await UserRoles().findOne({ userId }).exec();
  if (!roles) {
    roles = await createNonVerifiedUserRecord(userId, userName);
  }

  return addDefaults(roles);
}

// User has logged in for the first time, set up userRoles database record if does not exist
// and set the user as verified
async function createNonVerifiedUserRecord(userId, userName) {
  return addRecordForNewUser(userId, userName, true);
}

// User has not logged in, however their e-mail is being added to an existing project, hence
// set up userRoles record and set as not verified
async function createVerifiedUserRecord(userId, userName) {
  return addRecordForNewUser(userId, userName, false);
}

function convertToUser(roles) {
  const userRoles = roles.toObject();
  const userName = userRoles.userName ? userRoles.userName : 'Unknown user name';
  const user = { userId: userRoles.userId, name: userName, verified: userRoles.verified };
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

/*
Under some circumstances, duplicate records can be created for MongoDB users.
This function combines the roles for those users.
The underlying issue should be fixed - a technical debt story has been written.
If the roles are contradictory, the first one wins.
This is a reasonable approach, since when dealing with individual users,
findOne returns the first one (normally following insert order).
*/
function combineRoles(roles1, roles2) {
  return {
    ...roles2,
    ...roles1,
    projectRoles: [
      ...(roles2 ? roles2.projectRoles : []),
      ...(roles1 ? roles1.projectRoles : []),
    ],
  };
}

async function getAllUsersAndRoles() {
  const allRoles = await UserRoles().find().exec();
  const usersMap = allRoles
    .filter(roles => roles.userName) // only take users with known user names
    .reduce((uniqueUsersMap, roles) => { // convert to map, keyed by userId
      uniqueUsersMap[roles.userId] = combineRoles(uniqueUsersMap[roles.userId], addDefaults(roles)); // eslint-disable-line no-param-reassign
      return uniqueUsersMap;
    }, {});
  return Object.values(usersMap); // return users and roles
}

async function getProjectUsers(projectKey) {
  const query = { 'projectRoles.projectKey': { $eq: projectKey } };
  const projectUsers = await UserRoles().find(query).exec();
  return projectUsers.map(addDefaults);
}

async function addRecordForNewUser(userId, userName, verified = true) {
  const allRoles = await UserRoles().find().exec();
  if (doesUserIdExist(allRoles, userId)) {
    throw new Error(`Creating new user for userId: ${userId} ${userName}, but they already exist`);
  }

  // Create user - explictly overriding only userId & verified fields
  const overrideFields = {
    userId,
    verified,
  };

  if (allRoles.length === 0) {
    // Make the first ever user an instanceAdmin.
    logger.info(`${userName} is first user, so making instanceAdmin`);
    overrideFields.instanceAdmin = true;
  }

  // findAndUpdate used over create as user record may legitimately either
  // - Not exist
  // - Exist with set permissions prior to login
  // Hence upsert based on userName overriding userId explictly.
  return UserRoles().findOneAndUpdate(
    { userName },
    {
      $set: overrideFields,
      $setOnInsert: { projectRoles: [] },
    },
    { new: true, upsert: true },
  );
}

function doesUserIdExist(allUsers, userId) {
  return allUsers.filter(roles => roles.userId === userId).length > 0;
}

// Note - roleKey must exist in UserRolesSchema in userRoles.model.js
async function setSystemRole(userId, roleKey, roleValue) {
  const users = await UserRoles().find({ userId }).exec();
  if (!users || users.length === 0) {
    throw new Error(`Unrecognised user ${userId}`);
  }
  await Promise.all(users.map((roles) => {
    const { _id } = roles;
    roles[roleKey] = roleValue; // eslint-disable-line no-param-reassign
    return UserRoles().findOneAndUpdate({ _id }, roles, { upsert: true, setDefaultsOnInsert: true, runValidators: true });
  }));
  return users.map(addDefaults)[0];
}

async function addRole(userId, projectKey, role) {
  // Load existing user
  const query = { userId };
  let user = await UserRoles().findOne(query).exec();
  if (!user) {
    // If a role is added to a non-existant user, set verfied
    await createVerifiedUserRecord(userId, userId);
    user = await UserRoles().findOne(query).exec();
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

export default {
  combineRoles,
  getRoles,
  createNonVerifiedUserRecord,
  createVerifiedUserRecord,
  addRecordForNewUser,
  getUser,
  getUsers,
  getAllUsersAndRoles,
  getProjectUsers,
  setSystemRole,
  addRole,
  removeRole,
  userIsMember,
};
