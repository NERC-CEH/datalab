import database from '../config/database';
import { DELETED } from '../models/dataStorage.model';
import config from '../config/config';

function DataStorage() {
  return database.getModel('DataStorage');
}

function getAllActive({ sub }) {
  // Exclude records tagged as deleted
  const query = filterByUser(sub, { status: { $ne: DELETED } });
  return DataStorage().find(query).exec();
}

function getAllByName(_, name) { // user, name
  // For all users
  return DataStorage().findOne({ name }).exec();
}

function getById({ sub }, id) {
  const query = filterByUser(sub, { _id: id });
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

function addUsers(name, userIds) { // user, name, userId
  const updateObj = setUsers(userIds);
  return DataStorage().findOneAndUpdate({ name }, updateObj, { upsert: false, new: true }).exec();
}

function removeUsers(name, userIds) { // user, name, userId
  const updateObj = unsetUsers(userIds);
  return DataStorage().findOneAndUpdate({ name }, updateObj, { upsert: false, new: true }).exec();
}

const filterByUser = (userId, findQuery) => ({
  ...findQuery,
  users: { $elemMatch: { $eq: userId } },
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

export default { getAllActive, getAllByName, getById, getByName, createOrUpdate, deleteByName, update, addUsers, removeUsers };
