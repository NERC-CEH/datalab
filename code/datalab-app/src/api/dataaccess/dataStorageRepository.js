import database from '../config/database';
import { DELETED } from '../models/dataStorage.model';

function DataStorage() {
  return database.getModel('DataStorage');
}

function getAllActive({ sub }) {
  // Exclude records tagged as deleted
  const query = filterByUser(sub, { status: { $ne: DELETED } });
  return DataStorage().find(query).exec();
}

function getAllByName({ sub }, name) {
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
    ...setUsers([sub]),
  };
  return DataStorage().findOneAndUpdate(query, dataStore, { upsert: true, setDefaultsOnInsert: true });
}

function deleteByName({ sub }, name) {
  const query = filterByUser(sub, { name });
  return DataStorage().remove(query).exec();
}

function update({ sub }, name, updatedValues) {
  const updateObj = {
    ...setUsers([sub]),
    $set: updatedValues,
  };
  return DataStorage().findOneAndUpdate({ name }, updateObj, { upsert: false });
}

function addUsers({ sub }, name, userIds) {
  const updateObj = setUsers(userIds);
  return DataStorage().findOneAndUpdate({ name }, updateObj, { upsert: false });
}

function removeUsers({ sub }, name, userIds) {
  const updateObj = unsetUsers(userIds);
  return DataStorage().findOneAndUpdate({ name }, updateObj, { upsert: false });
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

export default { getAllActive, getAllByName, getById, getByName, createOrUpdate, deleteByName, update, addUsers, removeUsers };
