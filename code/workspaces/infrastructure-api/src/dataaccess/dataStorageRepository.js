import database from '../config/database';
import { DELETED } from '../models/dataStorage.model';
import config from '../config/config';

function DataStorage() {
  return database.getModel('DataStorage');
}

function getAllProjectActive({ sub }, projectKey) {
  // Exclude records tagged as deleted
  const query = filterByUserAndProject(sub, projectKey, { status: { $ne: DELETED } });
  return DataStorage().find(query).exec();
}

function getAllByName(_, name) { // user, name
  // For all users
  return DataStorage().findOne({ name }).exec();
}

function getById({ sub }, projectKey, id) {
  const query = filterByUserAndProject(sub, projectKey, { _id: id });
  return DataStorage().findOne(query).exec();
}

function getByName({ sub }, name) {
  const query = filterByUser(sub, { name });
  return DataStorage().findOne(query).exec();
}

function createOrUpdate({ sub }, requestedDataStore) {
  const query = filterByUser(sub, { name: requestedDataStore.name });
  const dataStore = {
    ...requestedDataStore,
    ...createStorageUrls(requestedDataStore),
    ...setUsers([sub]),
  };
  return DataStorage().findOneAndUpdate(query, dataStore, { upsert: true, setDefaultsOnInsert: true }).exec();
}

function deleteByName({ sub }, name) {
  const query = filterByUser(sub, { name });
  return DataStorage().remove(query).exec();
}

function update(name, updatedValues) {
  const updateObj = {
    $set: updatedValues,
  };
  return DataStorage().findOneAndUpdate({ name }, updateObj, { upsert: false }).exec();
}

function addUsers({ sub }, projectKey, name, userIds) {
  const query = filterByUserAndProject(sub, projectKey, { name });
  const updateObj = setUsers(userIds);
  return DataStorage().findOneAndUpdate(query, updateObj, { upsert: false, new: true }).exec();
}

function removeUsers({ sub }, projectKey, name, userIds) {
  const query = filterByUserAndProject(sub, projectKey, { name });
  const updateObj = unsetUsers(userIds);
  return DataStorage().findOneAndUpdate(query, updateObj, { upsert: false, new: true }).exec();
}

const filterByUser = (userId, findQuery) => ({
  ...findQuery,
  users: { $elemMatch: { $eq: userId } },
});

const filterByUserAndProject = (userId, projectKey, findQuery) => ({
  ...findQuery,
  users: { $elemMatch: { $eq: userId } },
  projectKey,
});

const setUsers = userIds => ({
  $addToSet: { users: { $each: userIds } },
});

const unsetUsers = userIds => ({
  $pull: { users: { $in: userIds } },
});

const createStorageUrls = requestedDataStore => ({
  url: `https://${requestedDataStore.projectKey}-${requestedDataStore.name}.${config.get('datalabDomain')}/minio`,
  internalEndpoint: `http://minio-${requestedDataStore.name}/minio`,
});

export default { getAllProjectActive, getAllByName, getById, getByName, createOrUpdate, deleteByName, update, addUsers, removeUsers };
